import { publishMessages, publishInput } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const music = async function music({ userId, channelId }, result, messages) {
  logger.debug('Processing onboarding.profileSetup.manual.music action.')

  // Schedule persistence
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  logger.debug('Publishing onboarding/profileSetup--manual#music responses.')
  await publishMessages(channelId, 'assistant', messages)

  // Then update the input to onboarding.ReadyButton
  logger.debug('Publishing onboarding/profileSetup--manual#music input changes.')
  publishInput(channelId, 'onboarding.manual.TrackUploader')
}

export default music
