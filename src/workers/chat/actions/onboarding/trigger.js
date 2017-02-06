import { logger } from 'io'
import { eventRequest } from 'io/apiai'
import { handleAPIAIAction } from 'workers/chat/actions'

const trigger = async function trigger(message) {
  logger.debug('Processing onboarding.trigger user action.')

  // Query API.ai without any additional contexts.
  const apiaiResponse = await eventRequest({
    name: 'onboarding/welcome'
  }, {
    contexts: [
      { name: 'authenticated' }
    ],
    sessionId: message.senderId
  })

  // Take the result and fulfill the action
  await handleAPIAIAction(message, apiaiResponse.result)
}

export default trigger
