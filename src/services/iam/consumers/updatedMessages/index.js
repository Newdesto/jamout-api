import Consumer from 'sqs-consumer'
import actionHandlers from './actionHandlers'

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-1.amazonaws.com/533183579694/iam-updatedMessages',
  async handleMessage({ Body }, done) {
    try {
      const { message, action } = JSON.parse(Body)
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
