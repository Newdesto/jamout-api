import merge from 'dynamo-merge'
import Message from '../models/Message/model'

const updateMessage = async function updateMessage(channelId, timestamp, updates) {
  const { attrs } = await Message.updateAsync({ channelId, timestamp }, merge(updates))
  return attrs
}

export default updateMessage
