import { publishMessages, publishInput } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const profileSetup = async function profileSetup({ userId, channelId }, result, messages) {
  logger.debug('Processing onboarding.profileSetup action.')
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  try {
    logger.debug('Publishing onboarding/profileSetup responses.')
    await publishMessages(channelId, 'assistant', messages)
  } catch (e) {
    logger.error(e)
  }

  // Then update the input to onboarding.ReadyButton
  logger.debug('Publishing onboarding/profileSetup input changes..')
  publishInput(channelId, 'onboarding.GotItButton')

  return messages
}

export default profileSetup
