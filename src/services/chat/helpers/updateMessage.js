import Message from '../models/Message/model'
import { getUpdateExpression } from '../utils/dynamoUpdate'

const updateMessage = async function updateMessage(channelId, timestamp, updates) {
  // Get the original first.
  const { attrs: original } = await Message.getAsync({ channelId, timestamp })

  console.log(getUpdateExpression(original, updates))
  const { attrs } = await Message.updateAsync({ channelId, timestamp }, getUpdateExpression(original, updates))
  return attrs
}

export default updateMessage
