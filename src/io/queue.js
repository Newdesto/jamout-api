/**
 * Creates the Kue queue
 */
import kue from 'kue'
import redis from 'redis'

// @TODO production redis connection
// https://github.com/Automattic/kue#redis-connection-settings
const queue = kue.createQueue({
  redis: {
     createClientFactory: () => redis.createClient() // @TODO production connection
  }
})

// promisifies create
export const createJob = (name, data) => new Promise((resolve, reject) => {
  queue.create(name, data).save(error => {
    if(error)
      reject(error)
    resolve(error)
  })
})

export default queue
