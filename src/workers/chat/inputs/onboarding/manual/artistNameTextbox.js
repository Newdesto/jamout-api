// IO
import { logger, queue, pubsub, apiai } from 'io'
import { eventRequest } from 'io/apiai'
import uuid from 'uuid'
import fulfill from 'workers/chat/fulfillments'
import Profile from 'models/Profile/model'

export const artistNameTextbox = async function artistNameTextbox({ userId, channelId, values }) {
  logger.debug('Processing onboarding.manual.ArtistNameTextbox input.')

  if(!values.text) {
    logger.error('PANIC! No text was sent',)
    throw new Error('Missing artist name value.')
  }

  // Save the artist name to their profile.
  await Profile.updateAsync({
    userId,
    displayName: values.text
  })

  // Query API.ai without any additional contexts.
  const apiaiResponse = await eventRequest({
    name: 'onboarding/profileSetup--manual#picture'
  }, {
    contexts: [
      { name: 'authenticated' }
    ],
    sessionId: userId
  })

  // Take the result and fulfill the action
  await fulfill({ channelId, userId }, apiaiResponse.result)
}

export default artistNameTextbox