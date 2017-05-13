import MessageModel from './model'

export const createMessage = async function createMessage(message) {
  const { attrs } = await MessageModel.createAsync(message)
  return attrs
}

export const getMessagesByChannelId = async function getMessageByChannelId(channelId) {
  if (!channelId) {
    throw new Error('Missing channel ID.')
  }

  const { Items } = await MessageModel
    .query(channelId)
    .descending()
    .execAsync()

  return Items.map(i => i.attrs)
}
