import Message from '../models/Message/model'

const getMessagesByChannelId = async function getMessageByChannelId(channelId) {
  if (!channelId) {
    throw new Error('Missing channel ID.')
  }

  const { Items } = await Message
    .query(channelId)
    .descending()
    .execAsync()

  return Items.map(i => i.attrs)
}

export default getMessagesByChannelId
