import { logger, queue } from 'io'
import Jimp from 'jimp'


queue.process('distribution.resize', async ({ data: { url } }, done) => {
  logger.debug(`Resizing Image (${url})`)

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

  done(null, buffer3000)
})
