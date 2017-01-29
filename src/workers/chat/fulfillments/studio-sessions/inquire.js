import { publishMessages, publishInput, toggleInput } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const inquire = async function inquire({ userId, channelId }, result, messages) {
  logger.debug('Processing studio-sessions.inquire action.')

  // Schedule Persistence.
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  await publishMessages(channelId, 'assistant', messages)

  // Disable the channel input.
  logger.debug(`Disabling the input for the channel: ${channelId}.`)
  toggleInput({
    channelId,
    enable: false
  })

  // Process the params and trigger the next relevant intent.
  console.log(JSON.stringify(result))

  return messages
}

export default inquire
