import { PubSub, SubscriptionManager } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from 'schema'
import { setupFunctions } from 'resolvers/subscriptions'
import logger from './logger'
import { createServer } from 'http'
import { setupSubscriptionContext } from 'middleware/graphql'
import JWT from 'jsonwebtoken'
import { createJob } from 'io/queue'
import User from 'models/User/model'
import { restoreInput } from 'utils/chat'
import pubsub from './pubsub'
// Create a GQL subscription manager using an EventEmitter as the pubsub
// engine, the setupFunctions from our resolver/subscription
// folder and our entire GQL schema.
//export const pubsub = new PubSub()
console.log(pubsub)
console.log(setupFunctions)
export const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions
})

/**
 * An onSubscribe listener that initializes the context and parameters for
 * the resolvers.
 */
export const onSubscribe = (msg, params, req) => {
  console.log(params)
  return {
    ...params,
    context: setupSubscriptionContext()
  }
}
