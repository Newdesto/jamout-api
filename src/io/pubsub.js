import { RedisPubSub } from 'graphql-redis-subscriptions'

const triggerTransform = (trigger, { path }) => [trigger, ...path].join('.')
const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  prefix: 'graphql', // @NOTE: I don't think redis uses prefix for pubsub
  enable_offline_queue: false
}

// @TODO shared redis client for DataLoader + PubSub
const pubsub = new RedisPubSub({
  connection,
  triggerTransform
})

export default pubsub
