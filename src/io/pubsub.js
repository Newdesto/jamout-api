import { RedisPubSub } from 'graphql-redis-subscriptions'

const triggerTransform = (trigger, { path }) => [trigger, ...path].join('.')
const connection = {
  host: 'localhost',
  port: 6379,
  prefix: 'graphql', // @NOTE: I don't think redis uses prefix for pubsub
  enable_offline_queue: false
}

// @TODO shared redis client for DataLoader + PubSub
const pubsub = new RedisPubSub({
  connection,
  triggerTransform
})

export default pubsub
