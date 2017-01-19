/**
 * Creates the Kue queue
 */
import kue from 'kue'
import redis from 'redis'

// @TODO production redis connection
// https://github.com/Automattic/kue#redis-connection-settings
const queue = kue.createQueue({
  redis: {
    createClientFactory: () => redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }) // @TODO production connection
  }
})

// Promisifies job creation. We allow a delay parameter because our
// write per second capacity is at 1 which is lame...
export const createJob = (name, data, delay) => new Promise((resolve, reject) => {
  const job = queue.create(name, data)

  if (delay)
    job.delay(delay)

  return job.save(error => {
    if (error)
      reject(error)
    resolve(job)
  })
})

export default queue
