import { handleAPIAIAction } from 'workers/chat/actions'
import Chat from 'services/chat'
import Release from 'models/Release'
import { eventRequest } from 'io/apiai'

const readableReleaseEnum = {
  SINGLE: 'single',
  EP: 'EP',
  ALBUM: 'album'
}

const dbReleaseEnum = {
  SINGLE: 's',
  EP: 'e',
  ALBUM: 'a'
}

const typeHandler = async function typeHandler({ user, channelId, values }) {
  // Let's up date the ReleaseTYpe message to show the selected type.
  // Since updateMessage deep merges we can just add a success: true property.
  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      done: true,
      selectedType: readableReleaseEnum[values.type]
    }
  })

  // Create or update a release. We're depending on the component to pass us
  // the releaseId.
  let releaseId = values.releaseId
  if (releaseId) {
    // Update the release.
    await Release.update(releaseId, {
      type: dbReleaseEnum[values.type]
    })
  } else {
    // Create a new release.
    const release = await Release.create({
      userId: user.id,
      type: dbReleaseEnum[values.type]
    })
    releaseId = release.id
  }

  // By now we should for sure have a release and can move onto the metadata.
  // Trigger an event on API.ai to post the distribution/metadata intent.
  const metadataResult = await eventRequest({
    name: 'distribution-metadata',
    data: {
      releaseId,
      type: readableReleaseEnum[values.type]
    }
  }, {
    sessionId: user.id
  })

  await handleAPIAIAction({ channelId, senderId: user.id }, metadataResult.result)
}

export default typeHandler
