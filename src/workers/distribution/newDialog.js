import { logger, queue, pubsub, apiai } from 'io'
import { eventRequestAndProcess } from 'utils/assistant'
import { createJob } from 'io/queue'
import Promise from 'bluebird'
import uuid from 'uuid'

queue.process('distribution:new', async ({ data: { userId } }, done) => {
  logger.debug(`Starting nonlinear distribution:new dialog for user (${userId})`)

  const { response, events } = await eventRequestAndProcess({
    name: 'distribution:new::type',
  }, {
    sessionId: userId // user id that is
  })

  // persist messages
  const jobs = await Promise.all(events.messages.map((message, index) => createJob('assistant.persistMessage', {
      title: `Persist assistant messages for user (${userId})`,
      message,
      userId,
    }, (index * 1000)))) // @NOTE the one second delay bc our write/sec = 1 LOL

  // Publish events to the client.
  // Priority: 1) Messages 2) Redirect 3) UI Updates
  events.messages.forEach(message => {
    // @NOTE we optimistically generate a timestamp and id
    message.createdAt = new Date().toISOString()
    message.id = uuid()
    pubsub.publish(`assistant.${userId}`, message)
  })

  done()
})
