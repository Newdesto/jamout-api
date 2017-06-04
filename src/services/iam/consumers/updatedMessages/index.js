import Consumer from 'sqs-consumer'
import actionHandlers from './actionHandlers'

const app = Consumer.create({
  queueUrl: process.env.QUEUE_IAM_UPDATED_MESSAGES,
  async handleMessage({ Body }, done) {
    try {
      const body = JSON.parse(Body)
      const { message, action } = body.sqs ? body.sqs : body
      const actionHandler = actionHandlers[action.type]

      if (actionHandler) {
        await actionHandler(message)
      }

      done()
    } catch (err) {
      done(err)
    }
  }
})

app.on('error', (err) => {
  console.error(err)
})

app.start()
