import { logger } from 'io'
import { eventRequest } from 'io/apiai'
import fulfill from 'workers/chat/fulfillments'

/**
 * This worker processes the `chat.events` job which sends an event request to
 * API.ai and routes the response to workers/chat/fulfillments.
 * @type {Object}
 */
export const welcomeButtonHandler =
async function welcomeButtonHandler({ userId, channelId }) {
  logger.debug('Processing onboarding.GotItButton input.')

  // Query API.ai without any additional contexts.
  const apiaiResponse = await eventRequest({
    name: 'onboarding/profileSetup#manualOrSoundCloud'
  }, {
    contexts: [
      { name: 'authenticated' }
    ],
    sessionId: userId
  })

  // Take the result and fulfill the action
  await fulfill({ channelId, userId }, apiaiResponse.result)
}

export default welcomeButtonHandler
