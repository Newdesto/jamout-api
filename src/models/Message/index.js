import messageModel from './model'
import subscriptionModel from '../Subscription'

export default class Message {
  // returns the last 25 messages if no limit is set
  // we rely on the client to set a default limit
  async getMessages(channelId, limit = 25) {
    const { Items } = await messageModel
      .query(channelId)
      .usingIndex('channelId-createdAt-index')
      .limit(limit)
      .descending()
      .execAsync()

    return Items.map(i => i.attrs)
  }
  async createMessage(userId, channelId, text) {
    const subscription = await subscriptionModel.getAsync({ userId, channelId })
    if(!subscription)
      throw new Error('Authorization failed.')

    const { attrs } = await messageModel.createAsync({
      userId,
      channelId,
      text
    })

    return attrs
  }
}
