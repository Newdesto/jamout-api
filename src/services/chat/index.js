import crypto from 'crypto'
import R from 'ramda'
import shortid from 'shortid'
import { pubsub } from 'io/subscription'
import { createJob } from 'io/queue'
import { publishMessages } from 'utils/chat'
import Channel from './channel'
import Message from './message'
import Subscription from './subscription'
import handlePostback from './postback'

/**
 * The chat service which is injected into the context of GQL queries. It's
 * constructed using a specific user ID and all methods are executed using
 * that userId.
 */
export default class Chat {
  constructor({ userId }) {
    this.userId = userId
    // Binding static methods to this instance. The GQL context uses
    // an instance so static methods are inaccessible.
    this.getMessagesByChannelId = Chat.getMessagesByChannelId
    this.updateMessage = Chat.updateMessage
    this.postback = Chat.postback
  }
  /**
   * A wrapper for createJob for testability.
   */
  static createJob(name, data) {
    return createJob(name, data)
  }
  /**
   * A wrapper for pubsub.publish for testability.
   */
  static publish(channel, data) {
    return pubsub.publish(channel, data)
  }
  /**
   * A wrapper for the publishMessages util function for testability
   */
  static publishMessages(...args) {
    return publishMessages(...args)
  }
  /**
   * Sorts an array of user IDs and creates a unique SHA1 hash.
   */
  static sortUsersAndHash({ users }) {
    if (!users || !Array.isArray(users)) {
      throw new Error('Invalid argument: users.')
    }

    const sortedUsers = users.sort()
    const usersHash = crypto.createHash('sha1').update(JSON.stringify(sortedUsers)).digest('hex')

    return {
      usersHash,
      users: sortedUsers
    }
  }
  /**
   * Returns the channel of a user hash if it exists, and returns false
   * if it doesn't.
   */
  static async channelExistsByHash({ usersHash }) {
    if (!usersHash) {
      throw new Error('The argument userHash is undefined.')
    }

    const { Items } = await Channel
      .query(usersHash)
      .usingIndex('usersHash-index')
      .execAsync()

    if (Items.length !== 0) {
      return Items[0].attrs
    }

    return false
  }
  /**
   * Creates subscriptions to a single channel for a set of users.
   */
  async createSubscriptions({ users, channelId }) {
    if (!Array.isArray(users) || !channelId) {
      throw new Error('Invalid arguments to create channel subscriptions.')
    }

    const subscriptions = await Promise.all(
      users.map(() => Subscription.createAsync({
        channelId,
        userId: this.userId
      }))
    )

    // Unneccessary flatten for tests.
    return R.flatten(subscriptions).map(s => s.attrs)
  }
  /**
   * Creates a new channel using the channel type and an array of users. Checks
   * to see if a channel already exists for the set of users. If so, it returns
   * it.
   */
  async createChannel({ type, users, name, superPowers = [] }) {
    // Sort the users array and hash that shit.
    const sorted = Chat.sortUsersAndHash({ users })

    // Check if a channel already exists for this user set.
    // @TODO Merge the user's subscription if Chat.createChannel returns an existing channel.
    const existingChannel = await Chat.channelExistsByHash({
      usersHash: sorted.usersHash
    })

    // Return the existing channel, dude.
    if (existingChannel) {
      return existingChannel
    }

    // No channels exist so let's create one.
    const { attrs: channel } = await Channel.createAsync({
      type,
      name,
      users: sorted.users,
      ownerId: this.userId,
      id: shortid.generate(),
      usersHash: sorted.usersHash,
      superPowers
    })

    // Let's create a subscription for each user in the set.
    const subscriptions = await this.createSubscriptions({
      users: sorted.users,
      channelId: channel.id
    })

    // Return the channel and subscription for the user.
    return {
      ...R.find(R.propEq('userId', this.userId))(subscriptions),
      ...channel
    }
  }
  /**
   * Sends a text message on behalf of the user.
   */
  async sendMessage({ message }) {
    // Check if the user is subscribed to this channel.
    const subscription =
    await Subscription.getAsync({ channelId: message.channelId, userId: this.userId })

    // If the sender was the assistnat don't throw an error.
    // The 'assistant' user doesn't receive a subscription.
    if (!subscription) {
      throw new Error('Authorization failed.')
    }

    // Get the channel so we can check what type it is.
    const channel = await Channel.getAsync(message.channelId)
    if (!channel.attrs) {
      throw new Error('Subscription exists but the channel does not.')
    }

    // If it's an assistant channel queue up a job to process this message.
    if (channel.attrs.type === 'a') {
      await createJob('chat.processMessage', { message })
    }

    // Throws an error if something fails.
    const { attrs } = await Message.createAsync(message)

    return attrs
  }
  /**
   * Updates a message given a channel and micro timestamp and publishes it
   * to the the channel.
   */
  static async updateMessage({ channelId, timestamp, ...input }) {
    if (!channelId || !timestamp) {
      throw new Error('Missing arguments needed to update a message.')
    }

    const { attrs } = await Message.updateAsync({ channelId, timestamp, ...input })
    console.log(attrs)
    await Chat.publishMessages(channelId, attrs.senderId, [attrs])
    return attrs
  }
  /**
   * Processes a postback object. A postback object is sent from a message
   * attachment. Postbacks are handled immediately. We're trying our best to
   * stay away from the overhead of users.
   */
  static async postback({ postback }) {
    const messages = await handlePostback(postback)
    return messages
  }
  /**
   * Get's a channel by its ID.
   */
  async getChannelById({ channelId }) {
    // Check if the user is subscribed to this channel.
    const subscription = await Subscription.getAsync({ userId: this.userId, channelId })
    if (!subscription) {
      throw new Error('Authorization failed.')
    }

    const channel = await Channel.getAsync({ id: channelId })
    if (!channel) {
      throw new Error('Invalid channel.')
    }

    return {
      ...subscription.attrs,
      ...channel.attrs
    }
  }
  /**
   * Gets a user's channels.
   */
  async getChannels() {
    const { Items } = await Subscription
      .query(this.userId)
      .execAsync()

    // Then get the related channels
    const channelIds = Items.map(i => i.attrs.channelId)
    const channels = await Channel.getItemsAsync(channelIds)
    return channels.map(item => item.attrs)
  }
  /**
   * Gets a channel's messages.
   */
  static async getMessagesByChannelId({ channelId, limit }) {
    if (!channelId || !limit) {
      throw new Error('Missing required arguments.')
    }

    const { Items } = await Message
      .query(channelId)
      .limit(limit)
      .descending()
      .execAsync()

    return Items.map(i => i.attrs)
  }
  /**
   * This is just a front function for createChannel aimed specifically at
   * a user's assistant channel.
   */
  async getAssistantChannel() {
    const channel = await this.createChannel({
      type: 'a',
      name: 'assistant',
      users: [this.userId]
    })
    return channel
  }
}
