import { publishMessages, publishInput } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const ready = async function ready({ userId, channelId }, result, messages) {
  logger.debug('Processing onboarding.welcomeAndReady action.')
  // Schedule Persistence.
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  await publishMessages(channelId, 'assistant', messages)

  // Then update the input to onboarding.ReadyButton
  logger.debug('Publishing onboarding/welcomeAndReady input changes..')
  publishInput(channelId, 'onboarding.ReadyButton')

  return messages
}

export default ready
