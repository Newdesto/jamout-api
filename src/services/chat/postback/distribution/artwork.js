import Chat from 'services/chat'
import Release from 'models/Release'
import Jimp from 'jimp'
import S3 from 'aws-sdk/clients/s3'
import { handleAPIAIAction } from 'workers/chat/actions'
import { eventRequest } from 'io/apiai'

const s3 = new S3()
const artworkHandler = async function artworkHandler({ user, channelId, values }) {
  try {
    // Resize the original to 3000x3000.
    const params = { Bucket: 'jamout-distribution', Key: `${values.artworkOriginalS3Key}` }
    const url = s3.getSignedUrl('getObject', params)
    const image = await Jimp.read(url)
    image.resize(3000, 3000)

    const buffer3000 = await new Promise((resolve, reject) => {
      image.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
        if (err) {
          reject(err)
        }

        resolve(buffer)
      })
    })

    // PutObject into the bucket
    const artworkS3Key = await new Promise((resolve, reject) => {
      s3.putObject({
        ACL: 'private',
        Body: buffer3000,
        Bucket: 'jamout-distribution',
        Key: `${values.releaseId}/artwork-3000.jpg`,
        Metadata: {
          userId: user.id
        }
      }, (err) => {
        if (err) {
          reject(err)
        }

        resolve(`${values.releaseId}/artwork-3000.jpg`)
      })
    })

    // Update the release with the original and the 3000x3000 keys.
    // @TODO No need to store the key. Since it's just the id and "artwork.jpg"
    // It's a waste of a network call.
    await Release.update(values.releaseId, {
      artworkS3Key,
      artworkOriginals3Key: values.artworkOriginalS3Key
    })

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
