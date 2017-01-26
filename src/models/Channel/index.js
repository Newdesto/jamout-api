import crypto from 'crypto'
import { createError } from 'apollo-errors'
import channelModel from './model'
import subscriptionModel from '../subscription'

const ChannelExistsError = createError('ChannelExistsError', {
  message: 'Channel already exists.'
})

export default class Channel {
  static async getChannelsByUserId(userId) {
    const { Items } = await subscriptionModel
      .query(userId)
      .execAsync()

    // then get the related channels
    const channelIds = Items.map(i => i.attrs.channelId)
    const channels = await channelModel.getItemsAsync(channelIds)
    return channels.map(item => item.attrs)
  }
  static async getById(id) {
    const channel = await channelModel.getAsync(id)
    // @TODO Check if the user has a subscription

    if (channel && channel.attrs) {
      return channel.attrs
    }

    return null
  }
  static async createChannel(type, users) {
    // Sort the user's who are in the channel and create a unique hash.
    const sortedUsers = users.sort()
    const usersHash = crypto.createHash('sha1').update(JSON.stringify(sortedUsers)).digest('hex')

    // query the usersHash index for any existing conversations
    // NOTE: GSI's have an eventual consistency
    // This means it takes a fraction of a second or longer in extreme cases
    // to update the index on puts/updates
    const { Count: exists } = await channelModel
      .query(usersHash)
      .usingIndex('usersHash-index')
      .select('COUNT')
      .execAsync()

    if (exists) { throw new ChannelExistsError() }

    // if none exists let's create it
    // @NOTE: Strictly DMs (name = null)
    const { attrs: channel } = await channelModel.createAsync({
      type,
      users: sortedUsers, // sorted array!
      usersHash
    })

    // let's create a subscription index for each user in the users array
    await subscriptionModel.createAsync(users.map(userId => ({ userId, channelId: channel.id })))

    return channel
  }
}
