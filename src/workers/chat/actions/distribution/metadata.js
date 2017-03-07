import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const metadata = async function metadata({ senderId, channelId }, result, messages) {
  logger.debug('Processing distribution/metadata action.')
  console.log(JSON.stringify(result))
  // Schedule persistence of the API.ai response messages.
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  await publishMessages(channelId, 'assistant', messages)
  return messages
}

export default metadata
