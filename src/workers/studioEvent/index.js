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

queue.process('studio-sessions:inquire', async ({ data }, done) => {
  logger.debug(`Creating linear studio session inquiry for (${data.userId})`)
  let { date, studio, time, userId } = data;
  const NewEvent = new StudioEvent()

  // if all data is present, create inquiry
  if ( date && studio && time && userId ) {
    const inquiry = await NewEvent.createStudioEvent(data.userId, 'new-inquiry', data)
    await eventRequestAndProcess({ name: 'studio-session:inquire--start-complete' }, { sessionId: userId })
    done(null, inquiry)
  }

  // if not, post data to redis
  const client = redis.createClient()
  client.on('error', e => {
    logger.error(e)
    throw new Error('Redis error.')
  })

  // cache the input
  await new Promise((resolve, reject) => {
    client.hmset(`${userId}.studio-inquiry-data`, { ...data }, (err, ok) => {
      if(err)
        reject(err)
      resolve(ok)
    })
  })

  // start the process!
  await createJob('studio-session:inquire--controller', { userId });
  
  done()
});
