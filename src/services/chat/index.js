import Channel from './Channel'
import Message from './Message'
import Subscription from './Subscription'
import crypto from 'crypto'
import R from 'ramda'
import shortid from 'shortid'
import pubsub from 'io/pubsub'
import microtime from 'microtime'
import { createJob } from 'io/queue'

/**
 * The chat service which is injected into the context of GQL queries. It's
 * constructed using a specific user ID and all methods are executed using
 * that userId.
 */
export default class Chat {
  constructor({ userId }) {
    this.userId = userId
  }
  /**
   * Sorts an array of user IDs and creates a unique SHA1 hash.
   */
  sortUsersAndHash({ users }) {
    if(!users || !Array.isArray(users)) {
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
  async channelExistsByHash({ usersHash }) {
    if(!usersHash) {
      throw new Error('The argument userHash is undefined.')
    }

    const { Items } = await Channel
      .query(usersHash)
      .usingIndex('usersHash-index')
      .execAsync()

    if(Items.length !== 0) {
      return Items[0].attrs
    }

    return false
  }
  /**
   * Creates subscriptions to a single channel for a set of users.
   */
  async createSubscriptions({ users, channelId }) {
    if(!Array.isArray(users) || !channelId) {
      throw new Error('Invalid arguments to create channel subscriptions.')
    }

    const subscriptions = await Promise.all(
      users.map(userId => Subscription.createAsync({
        channelId,
        userId: this.userId
      }))
    )

    return subscriptions
  }
  /**
   * Creates a new channel using the channel type and an array of users. Checks
   * to see if a channel already exists for the set of users. If so, it returns
   * it.
   */
  async createChannel({ type, users, name }) {
    // Sort the users array and hash that shit.
    const sorted = this.sortUsersAndHash({ users })

    // Check if a channel already exists for this user set.
    const existingChannel = await this.channelExistsByHash({
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
      usersHash: sorted.usersHash
    })

    // Let's create a subscription for each user in the set.
    const subscriptions = await this.createSubscriptions({
      users: sorted.users,
      channelId: channel.id
    })

    // Return the channel and subscription for the user.
    return {
      ...R.find(R.propEq('userId', this.userId))(subscriptions.map(s => s.attrs)),
      ...channel
    }
  }
  /**
   * Process an input object. Generally this will be a Textbox but in some cases
   * it could be some other component. See the Input type in the GQL schema.
   * Returns the persisted message.
   */
  async sendInput({ input }) {
    // Persist the message in DDB.
    if (input.message) {
      // Check if the user is subscribed to this channel.
      const subscription = await Subscription.getAsync({ userId: this.userId, channelId: input.channelId })
      if (!subscription) {
        throw new Error('Authorization failed.')
      }
      console.log(subscription)
      // Throws an error if something fails.
      const { attrs } = await Message.createAsync({
        ...input.message,
        id: shortid.generate(),
        timestamp: microtime.nowDouble().toString()
      })

      // Anti-immutability = bad but oh well
      input.message = attrs
    }

    if(!input.bypassQueue) {
      // Create a job to process the text. This is generally used
      // in assistant channels.
      const job = await createJob('chat.input', input)
    } else {
      // If we're skipping the job just publish the message in the pubsub.
      // This is generally used in DMs or Groups.
      pubsub.publish(`messages.${message.channelId}`, message)
    }

    return input.message
  }
  /**
   * Processes a postback object. A postback object is sent from a message
   * attachment (this is different than an input). The postback object will
   * look similar to an input. This method queues a job to process postbacks
   * and nothing more. We could register function for a more immediate
   * execution, but that's lame.
   */
  async postback({ postback }) {
    const job = await createJob('chat.postback', postback)
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
  async getMessagesByChannelId({ channelId, limit }) {
    const { Items } = await Message
      .query(channelId)
      .usingIndex('channelId-createdAt-index')
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
