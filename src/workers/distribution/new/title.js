import { logger, queue, pubsub, apiai } from 'io'
import { eventRequestAndProcess } from 'utils/assistant'
import { createJob } from 'io/queue'
import redis from 'redis'
import uuid from 'uuid'
import Promise from 'bluebird'

const typeEnum = {
  e: 'EP',
  s: 'Single',
  a: 'album'
}

queue.process('distribution:new--title', async ({ data: { type, userId } }, done) => {
  // Get the events from API.ai
  const { response, events } = await eventRequestAndProcess({
    name: 'distribution:new--title',
  }, {
    sessionId: userId // user id that is
  })

  // Inject the selected type
  events.messages = events.messages.map(m => {
    if(m.text)
      m.text = m.text.replace('$TYPE', typeEnum[type])
    return m
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

  pubsub.publish(`assistant.${userId}`, {
    ...events.input,
    dialog: 'distribution:new',
    next: 'distribution:new--title'
  })

  done()
})
