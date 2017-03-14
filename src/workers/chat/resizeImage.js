import { logger, queue } from 'io'
import S3 from 'aws-sdk/clients/s3'
import Release from 'models/Release'
import Jimp from 'jimp'

const s3 = new S3()
queue.process('distribution.resize', async ({ data: { releaseId, userId, artworkOriginalS3Key } }, done) => {
  logger.info(`Resizing Image (${artworkOriginalS3Key})`)

  const params = { Bucket: 'jamout-distribution', Key: `${artworkOriginalS3Key}` }
  const url = await new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, presigned) => {
      if (err) {
        reject(err)
      }
      resolve(presigned)
    })
  })

  logger.info(url)
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
      Key: `${releaseId}/artwork-3000.jpg`,
      Metadata: {
        userId
      }
    }, (err) => {
      if (err) {
        reject(err)
      }
      resolve(`${releaseId}/artwork-3000.jpg`)
    })
  })
  logger.debug(artworkOriginalS3Key)
  // Update the release with the original and the 3000x3000 keys.
  // @TODO No need to store the key. Since it's just the id and "artwork.jpg"
  // It's a waste of a network call.
  await Release.update(releaseId, {
    artworkS3Key,
    artworkOriginalS3Key
  })
  done(null, buffer3000)
})
