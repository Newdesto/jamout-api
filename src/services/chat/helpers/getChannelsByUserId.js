import Channel from '../models/Channel/model'
import Subscription from '../models/Channel/subscriptionModel'

const getChannelsByUserId = async function getChannelsByUserId(userId) {
  const { Items } = await Subscription
    .query(userId)
    .execAsync()

  const channels = await Channel.getItemsAsync(Items.map(i => i.attrs.channelId))

  return channels
}

export default getChannelsByUserId
