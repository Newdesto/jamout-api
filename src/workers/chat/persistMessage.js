import { logger, queue } from 'io'
import Message from 'models/Message'
import BPromise from 'bluebird'

queue.process('chat.persistMessage', async ({ data: { message } }, done) => {
  logger.debug(`Persisting assistant message for user (${message.senderId})`)

  const messageConnector = new Message()
  const persisted = await messageConnector.create(message)
  // A delay is set because the DDB read/sec is 1... LOL.
  await BPromise.delay(1000)

  done(null, persisted.id)
})
