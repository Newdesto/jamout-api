import { logger, queue, pubsub, apiai } from 'io'
import { textRequest } from 'io/apiai'
import StudioEvent from 'models/StudioEvent'
import { eventRequestAndProcess } from 'utils/assistant'
import Promise from 'bluebird'
import { createJob } from 'io/queue'
import uuid from 'uuid'
import redis from 'redis'
import { postbackById } from 'utils/postback'


// orchestrates the studio session inquiry process

queue.process('studio-session:inquire--complete', async ({ data }, done) => {
  const { userId } = data;
  logger.debug(`Finishing linear studio session inquiry for (${userId})`)

  // get what data is present
   const client = redis.createClient()
   client.on('error', e => {
     logger.error(e)
     throw new Error('Redis error.')
   })

  // get the given studio data
   const studioData = await new Promise((resolve, reject) => {
     client.hgetall(`${userId}.studio-inquiry-data`, (err, ok) => {
       if(err)
         reject(err)
       resolve(ok)
     })
   })

   // get the given studio data
    const querriedData = await new Promise((resolve, reject) => {
      client.hgetall(`${userId}.studio-sessions:inquire`, (err, ok) => {
        if(err)
          reject(err)
        resolve(ok)
      })
    })

  const totalData = {
    ...studioData,
    ...querriedData
  }

  const NewEvent = new StudioEvent()
  const inquiry = await NewEvent.createStudioEvent(userId, 'new-inquiry', totalData)

  const { response, events } = await eventRequestAndProcess({ name: 'studio-session:inquire--complete' }, { sessionId: userId })

  console.log(events)
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


  await new Promise((resolve, reject) => {
   client.del(`${userId}.studio-inquiry-data`, (err, ok) => {
     if(err)
       reject(err)
     resolve(ok)
    })
  })

  await new Promise((resolve, reject) => {
   client.del(`${userId}.studio-sessions:inquire`, (err, ok) => {
     if(err)
       reject(err)
     resolve(ok)
    })
  })

  done(null, inquiry)

});
