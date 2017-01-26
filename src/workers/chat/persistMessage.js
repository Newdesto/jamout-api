import { logger, queue } from 'io'
import Message from 'services/chat/message'
import BPromise from 'bluebird'

queue.process('chat.persistMessage', async ({ data: { message } }, done) => {
  logger.debug(`Persisting assistant message for user (${message.senderId})`)

  // We trust that the function that queued this job checked for a subscription.
  const { attrs } = await Message.createAsync(message)

  // A delay is set because the DDB read/sec is 1... LOL.
  await BPromise.delay(1000)

  done(null, attrs.id)
})
