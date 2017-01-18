import { publishMessages, publishInput } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const picture = async function picture({ userId, channelId }, result, messages) {
  logger.debug('Processing onboarding.profileSetup.manual.picture action.')

  // Schedule persistence
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  logger.debug('Publishing onboarding/profileSetup--manual#picture responses.')
  await publishMessages(channelId, 'assistant', messages)

  // Then update the input to onboarding.ReadyButton
  logger.debug('Publishing onboarding/profileSetup--manual#picture input changes.')
  publishInput(channelId, 'onboarding.manual.PictureUploader', {
    ephemeral: true, // Disappear after input is sent
    hint: 'Type your artist name here and press enter...',
    componentMask: 'onboarding.manual.ArtistNameTextbox'
  })

  return messages
}

export default picture
