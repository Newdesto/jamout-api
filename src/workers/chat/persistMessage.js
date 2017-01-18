import { logger, queue, pubsub, apiai } from 'io'
import Message from 'models/Message'
import { textRequest } from 'io/apiai'
import Promise from 'bluebird'

queue.process('chat.persistMessage', async function persistMessage({ data: { message } }, done) {
  logger.debug(`Persisting assistant message for user (${message.senderId})`)

  const messageConnector = new Message()
  const persisted = await messageConnector.create(message)
  // A delay is set because the DDB read/sec is 1... LOL.
  await Promise.delay(1000)

  done(null, persisted.id)
})
