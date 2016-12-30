import { logger, queue, pubsub } from 'io'

queue.process('assistant.process', ({ data }, done) => {
  logger.debug(`Processing assistant message from user (${data.userId})`)
  // publish typing
  pubsub.publish('assistant.abc123', {
    __type: 'AssistantTyping',
    createdAt: Date.now(),
    type: 'typing.start',
    userId: data.userId
  })
  done()
})
