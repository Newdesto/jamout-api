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

queue.process('studio-session:inquire--controller', async ({ data }, done) => {
  const { userId } = data;
  logger.debug(`Controlling linear studio session inquiry for (${userId})`)

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
  if (!totalData.studio) {
    const job = await createJob('studio-session:inquire--studio', {
      userId,
    })
  } else if (!totalData.date) {
    const job = await createJob('studio-session:inquire--date', {
      userId,
    })
  } else if (!totalData.time) {
    const job = await createJob('studio-session:inquire--time', {
      userId,
    })
  }

  if (totalData.studio && totalData.date && totalData.time) {
    const job = await createJob('studio-session:inquire--complete', {
      userId,
    })
  }

  done()

});
