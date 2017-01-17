import { publishMessages, publishInput } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const manualOrSoundCloud = async function manualOrSoundCloud({ userId, channelId }, result, messages) {
  logger.debug('Processing onboarding.profile.manualOrSoundCloud action.')

  // Schedule persistence
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  logger.debug('Publishing onboarding/profileSetup#manualOrSoundCloud responses.')
  await publishMessages(channelId, 'assistant', messages)

  // Then update the input to onboarding.ReadyButton
  logger.debug('Publishing onboarding/profileSetup#manualOrSoundCloud input changes..')
  publishInput(channelId, 'onboarding.ManualOrSoundCloudButtons')

  return messages
}

export default manualOrSoundCloud
