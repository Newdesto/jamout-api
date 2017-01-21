import Channel from './Channel'
import Message from './Message'
import Subscription from './Subscription'
import crypto from 'crypto'
import R from 'ramda'
import shortid from 'shortid'

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
        userId,
        channelId: channel.id
      }))
    )
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
      usersHash,
      users: sortedUsers,
      ownerId: this.userId,
      id: shortid.generate()
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
  sendMessage() {

  }
  getChannels() {

  }
  getMessages() {

  }
  getAssistantChannel() {

  }
}
