/**
* @TODO Move from Redis to Centrifugo (possibly backed by Redis).
* The Redis pubsub module is responsible for real time subscription
* messaging. Meaning, any time we need to send an event to a client we
* publish it to a Redis channel.
*/
import { RedisPubSub } from 'graphql-redis-subscriptions'

/**
 * Joins a bunch of strings to create a path namespaced by periods.
 * e.g.; message.abc-123
 * @param  {[type]} trigger [description]
 * @param  {[type]} path    [description]
 * @return {[type]}         [description]
 */
const triggerTransform = (trigger, { path }) => [trigger, ...path].join('.')

/**
 * Redis connection configuration.
 * @type {Object}
 */
const connection = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
}

// The Redis pubsub wrapper to be used by GQL subscriptions.
const pubsub = new RedisPubSub({
  connection,
  triggerTransform
})

export default pubsub
