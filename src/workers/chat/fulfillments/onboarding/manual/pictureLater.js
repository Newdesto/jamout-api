import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'

const picture = async function picture({ userId, channelId }, result, messages) {
  logger.debug('Processing onboarding.profileSetup.manual.pictureLater action.')

  // Schedule persistence
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  logger.debug('Publishing onboarding/profileSetup--manual#pictureLater responses.')
  await publishMessages(channelId, 'assistant', messages)

  return messages
}

export default picture
