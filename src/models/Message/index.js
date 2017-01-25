import messageModel from './model'
import subscriptionModel from '../subscription'

export default class Message {
  // returns the last 25 messages if no limit is set
  // we rely on the client to set a default limit
  static async getMessages(channelId, limit = 25) {
    const { Items } = await messageModel
      .query(channelId)
      .usingIndex('channelId-createdAt-index')
      .limit(limit)
      .descending()
      .execAsync()

    return Items.map(i => i.attrs)
  }
  static async create(input) {
    const subscription =
      await subscriptionModel.getAsync({ userId: input.senderId, channelId: input.channelId })
    if (!subscription) {
      throw new Error('Authorization failed.')
    }

    // Throws an error if something fails.
    const { attrs } = await messageModel.createAsync(input)

    return attrs
  }
}
