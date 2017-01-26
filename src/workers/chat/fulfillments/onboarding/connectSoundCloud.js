import { publishMessages, publishInput } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const connectSoundCloud =
async function connectSoundCloud({ userId, channelId }, result, messages) {
  logger.debug('Processing onboarding.profileSetup.soundcloud.connect action.')

  // Schedule persistence
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  logger.debug('Publishing onboarding/profileSetup--soundcloud#connect responses.')
  await publishMessages(channelId, 'assistant', messages)

  // Then update the input to onboarding.ReadyButton
  logger.debug('Publishing onboarding/profileSetup--soundcloud#connect input changes..')
  publishInput(channelId, 'onboarding.ConnectSoundCloudButton')

  return messages
}

export default connectSoundCloud
