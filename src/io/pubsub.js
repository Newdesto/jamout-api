import { RedisPubSub } from 'graphql-redis-subscriptions'

const connection = {
  host: 'localhost',
  port: 6379,
  prefix: 'graphql',
  enable_offline_queue: false
}

const pubsub = new RedisPubSub({
  connection
})

export default pubsub
