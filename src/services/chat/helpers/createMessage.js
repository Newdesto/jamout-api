import Message from '../models/Message/model'

const createMessage = async function createMessage(message) {
  const { attrs } = await Message.createAsync(message)
  return attrs
}

export default createMessage
