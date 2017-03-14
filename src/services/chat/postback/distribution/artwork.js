import Chat from 'services/chat'
import { handleAPIAIAction } from 'workers/chat/actions'
import { eventRequest } from 'io/apiai'
import logger from 'io/logger'
import { createJob } from 'io/queue'

const artworkHandler = async function artworkHandler({ user, channelId, values }) {
  try {
    logger.info(`Uploading artwork`)
    const jobParams = {
      artworkOriginalS3Key: values.artworkOriginalS3Key,
      userId: user.id,
      releaseId: values.releaseId
    }
    createJob('distribution.resize', jobParams)

    // Let's update the ReleaseArtwork message to show the artwork.
    await Chat.updateMessage({
      channelId,
      timestamp: values.timestamp,
      attachment: {
        done: true,
        artworkOriginalS3Key: values.artworkOriginalS3Key
      }
    })

    // Trigger the event request on API.ai.
    const metadataResult = await eventRequest({
      name: 'distribution-tracklist',
      data: {
        releaseId: values.releaseId
      }
    }, {
      sessionId: user.id
    })

    await handleAPIAIAction({ channelId, senderId: user.id }, metadataResult.result)
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default artworkHandler
