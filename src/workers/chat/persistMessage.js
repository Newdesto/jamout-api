import { logger, queue, pubsub, apiai } from 'io'
import Message from 'services/chat/Message'
import { textRequest } from 'io/apiai'
import Promise from 'bluebird'

queue.process('chat.persistMessage', async function persistMessage({ data: { message } }, done) {
  logger.debug(`Persisting assistant message for user (${message.senderId})`)

  // We trust that the function that queued this job checked for a subscription.
  const { attrs } = await Message.createAsync(message)

  // A delay is set because the DDB read/sec is 1... LOL.
  await Promise.delay(1000)

  done(null, attrs.id)
})
