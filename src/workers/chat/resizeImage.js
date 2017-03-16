import { logger, queue } from 'io'
import S3 from 'aws-sdk/clients/s3'
import Release from 'models/Release'
import sharp from 'sharp';

const s3 = new S3()
queue.process('distribution.resize', async ({ data: { releaseId, userId, artworkOriginalS3Key } }, done) => {
  logger.info(`Resizing Image (${artworkOriginalS3Key})`)

  const params = { Bucket: 'jamout-distribution', Key: `${artworkOriginalS3Key}` }
  const image = await new Promise((resolve, reject) => {
    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data.Body)
    })
  })

  logger.info(image)
  const buffer3000 = await sharp(image)
    .resize(3000, 3000)
    .jpeg({
      quality: 100
    })
    .toBuffer()
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
  // Update the release with the original and the 3000x3000 keys.
  // @TODO No need to store the key. Since it's just the id and "artwork.jpg"
  // It's a waste of a network call.
  await Release.update(releaseId, {
    artworkS3Key,
    artworkOriginalS3Key
  })
  done(null, buffer3000)
})
