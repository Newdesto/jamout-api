import { logger, queue, pubsub, apiai } from 'io'
import AssistantMessage from 'models/AssistantMessage'
import { textRequest } from 'io/apiai'

queue.process('assistant.persistMessage', async ({ data: { message, userId } }, done) => {
  logger.debug(`Persisting assistant message for user (${userId})`)
  //console.log(JSON.stringify(message))
  const amConnector = new AssistantMessage()
  const amPersisted = await amConnector.create(message)

  done(null, amPersisted.id)
})
