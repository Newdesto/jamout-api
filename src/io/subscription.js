import { SubscriptionManager, PubSub } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from 'schema'
import { setupFunctions } from 'resolvers/subscriptions'
import { setupSubscriptionContext } from 'middleware/graphql'

// Create a GQL subscription manager using an EventEmitter as the pubsub
// engine, the setupFunctions from our resolver/subscription
// folder and our entire GQL schema.
export const pubsub = new PubSub()
export const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions
})

/**
 * An onSubscribe listener that initializes the context and parameters for
 * the resolvers.
 */
export const onSubscribe = (msg, params) => ({
  ...params,
  context: setupSubscriptionContext()
})
const startSubscriptionServer = function startSubscriptionServer(httpServer) {
  return new SubscriptionServer({ subscriptionManager, onSubscribe }, httpServer)
}

export default startSubscriptionServer
