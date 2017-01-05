import { logger, queue } from 'io'
import { eventRequestAndProcess } from 'utils/assistant'
import { createJob } from 'io/queue'
import redis from 'redis'

queue.process('distribution:new', async ({ data: { userId } }, done) => {
  // Reset the cache in Redis
  const client = redis.createClient()
  client.on('error', e => {
    logger.error(e)
    done('Redis error.')
  })

  await new Promise((resolve, reject) => {
    client.del(`${userId}.distribution:new`, (err, ok) => {
      if(err)
        reject(err)
      resolve(ok)
    })
  })

  // Queue the Release type job
  const job = await createJob('distribution:new--type', { userId })
  done()
})
