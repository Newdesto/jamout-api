/**
 * The Redis module is a application wide connection that can be used
 * for anything, most likely cache.
 */
import redis from 'redis'

// Create a Redis client.
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
})

export default client
