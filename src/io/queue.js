/**
 * The Queue module creates a Kue (https://github.com/Automattic/kue) queue
 * so jobs can be created and workers can be registered. We went with Kue
 * because it was easy to setup and implement.
 * A future @TODO is to move our queue to AWS SNS/SQS and Golang workers.
 * AWS because we won't have to manage our own Redis instance and because
 * it's scaleable. And Golang workers because we can run concurrent workers
 * and create binaries.
 */
import kue from 'kue'
import redis from 'redis'

// Create a new Kue queue.
const queue = kue.createQueue({
  redis: {
    createClientFactory: () => redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    })
  }
})

/**
 * Creates a new job in the Kue queue.
 * @param  {String} name  Name of the job
 * @param  {Object} data  Data to be sent to the worker
 * @param  {Integer} delay Delay before the job is live in ms
 * @return {Promise}       Prmise that resolves with the job details
 */
export const createJob = function createJob(name, data, delay) {
  return new Promise((resolve, reject) => {
    const job = queue.create(name, data)

    if (delay) { job.delay(delay) }

    return job.save((error) => {
      if (error) { reject(error) }
      resolve(job)
    })
  })
}

export default queue
