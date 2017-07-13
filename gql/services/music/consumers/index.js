import Consumer from 'sqs-consumer'
import logger from 'gql/io/logger'
import releaseReadyCheck from './releaseReadyCheck'

const app = Consumer.create({
  queueUrl: process.env.QUEUE_MUSIC,
  async handleMessage({ MessageId, Body }, done) {
    try {
    /**
     * NOTE: Messages that are sent to the music service are ONLY
     * S3 events as of right now.
     */
      console.log(typeof Body)
      console.log(Body)
      const body = JSON.parse(Body)
      const message = JSON.parse(body.Message)
      const objectKey = message.Records[0].s3.object.key
      await releaseReadyCheck(objectKey)

      done()
    } catch (err) {
      logger.error(err)
      done(err)
    }
  }
})

app.on('error', (err) => {
  console.error(err)
})

app.start()
