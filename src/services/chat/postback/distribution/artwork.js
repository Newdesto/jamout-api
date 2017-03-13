import Chat from 'services/chat'
import Release from 'models/Release'
import Jimp from 'jimp'
import S3 from 'aws-sdk/clients/s3'
import { handleAPIAIAction } from 'workers/chat/actions'
import { eventRequest } from 'io/apiai'
import logger from 'io/logger'
import { createJob } from 'io/queue'

const s3 = new S3()
const artworkHandler = async function artworkHandler({ user, channelId, values }) {
  try {
    // Resize the original to 3000x3000.
    const params = { Bucket: 'jamout-distribution', Key: `${values.artworkOriginalS3Key}` }
    const url = await new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', params, (err, presigned) => {
        if (err) {
          reject(err)
        }

        resolve(presigned)
      })
    })
    logger.info(url)

    const jobParams = {
      artworkOriginalS3Key: values.artworkOriginalS3Key,
      userId: user.id,
      releaseId: values.releaseId,
      url
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
