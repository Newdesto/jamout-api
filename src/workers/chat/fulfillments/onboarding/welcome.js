import { publishMessages, publishInput } from 'utils/chat'
import { createJob } from 'io/queue'
import User from 'models/User/model'

const welcome = async function welcome({ userId, channelId }, result, messages) {
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Update the user before we publish
  await User.updateAsync({
    id: userId,
    didOnboard: true
  })

  // Publish the messages to the channel's pubsub channel
  await publishMessages(channelId, 'assistant', messages)

  // Then update the input to onboarding.WelcomeButton
  publishInput(channelId, 'onboarding.WelcomeButton')

  return messages
}

export default welcome
