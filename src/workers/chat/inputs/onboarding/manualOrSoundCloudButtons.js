// IO
import { logger, queue, pubsub, apiai } from 'io'
import { eventRequest } from 'io/apiai'
import fulfill from 'workers/chat/fulfillments'

export const manualOrSoundCloudButtons = async function manualOrSoundCloudButtons({ userId, channelId, values }) {
  logger.debug('Processing onboarding.ManualOrSoundCloudButtons input.')

  let eventName
  if(values.profileSetup == 'sc') {
    eventName = 'onboarding/profileSetup--soundcloud#connect'
  } else {
    eventName = 'onboarding/profileSetup--manual#artistName'
  }

  // Query API.ai without any additional contexts.
  const apiaiResponse = await eventRequest({
    name: eventName
  }, {
    contexts: [
      { name: 'authenticated' }
    ],
    sessionId: userId
  })

  // Take the result and fulfill the action
  await fulfill({ channelId, userId }, apiaiResponse.result)
}

export default manualOrSoundCloudButtons
