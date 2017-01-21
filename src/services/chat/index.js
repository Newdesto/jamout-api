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
   * Creates a new channel using the channel type and an array of users. Checks
   * to see if a channel already exists for the set of users. If so, it returns
   * it.
   */
  async createChannel({ type, users, name }) {
    // Sort the users array and hash that shit.
    const sortedUsers = users.sort()
    const usersHash = crypto.createHash('sha1').update(JSON.stringify(sortedUsers)).digest('hex')

    // Query the usersHash index for any existing conversations
    const { Items } = await Channel
      .query(usersHash)
      .usingIndex('usersHash-index')
      .execAsync()

    if(Items.length !== 0) {
      // Return the existing channel, there should never be more than one so
      // the first element should do.
      return Items[0].attrs
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
    const subscriptions = await Promise.all(
      users.map(userId => Subscription.createAsync({
        userId,
        channelId: channel.id
      }))
    )

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
