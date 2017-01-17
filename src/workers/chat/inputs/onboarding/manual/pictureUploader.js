// IO
import { logger, queue, pubsub, apiai } from 'io'
import { eventRequest } from 'io/apiai'
import uuid from 'uuid'
import fulfill from 'workers/chat/fulfillments'
import Profile from 'models/Profile/model'

export const pictureUploader = async function pictureUploader({ userId, channelId, values }) {
  logger.debug('Processing onboarding.manual.PictureUploader input.')

  // If later = true but there's also a bucket or key PANIC!
  if (values.later && (values.bucket || values.key)) {
    logger.error('PANIC! Invalid combination of values.')
    throw new Error('Invalid combination of values.')
  }

  // If later = false but they're missing a bucket or key PANIC!
  if (!values.later && (!values.bucket || !values.key)) {
    logger.error('PANIC! Missing bucket or key values.')
    throw new Error('Missing bucket or key values.')
  }

  // Save the artist name to their profile if they uploaded a picture.
  if(!values.later) {
    await Profile.updateAsync({
      userId,
      avatarKey: values.key // The bucket is only used for the message attachment
    })
  }


  // If the user skipped we have to trigger an extra event.
  if(values.later) {
    const laterResponse = await eventRequest({
      name: 'onboarding/profileSetup--manual#pictureLater'
    }, {
      contexts: [
        { name: 'authenticated' }
      ],
      sessionId: userId
    })
    await fulfill({ channelId, userId }, laterResponse.result)
  }


  // Trigger the manual music upload event.
  const apiaiResponse = await eventRequest({
    name: 'onboarding/profileSetup--manual#music'
  }, {
    contexts: [
      { name: 'authenticated' }
    ],
    sessionId: userId
  })

  // Take the result and fulfill the action
  await fulfill({ channelId, userId }, apiaiResponse.result)
}

export default pictureUploader
