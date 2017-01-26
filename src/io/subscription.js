import { SubscriptionManager } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from 'schema'
import { setupFunctions } from 'resolvers/subscriptions'
import { setupSubscriptionContext } from 'middleware/graphql'
import JWT from 'jsonwebtoken'
import { createJob } from 'io/queue'
import User from 'models/User/model'
import pubsub from './pubsub'

// Create a GQL subscription manager using Redis as the pubsub
// engine, the setupFunctions from our resolver/subscription
// folder and our entire GQL schema.
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions
})

/**
 * An onSubscribe listener that initializes the context and parameters for
 * the resolvers. We also stuck in a conditional that creates a
 * chat.event job if the user hasn't been introduced to Jamout Assistant.
 * This job sends some onboarding messages.
 * @TODO Refactor this because it's booty.
 */
const onSubscribe = async function onSubscribe(msg, params) {
  // Triggers onboarding when an assistant sub starts.
  if (msg.type === 'subscription_start' && msg.variables.assistantChannelId) {
    // Verify the JWT.
    const verified = JWT.verify(msg.variables.jwt, process.env.JWT_SECRET)
    // The JWT can be outdated so check out the DB.
    const { attrs: user } = await User.getAsync(verified.id)
    if (!user.didOnboard) {
      await createJob('chat.event', {
        userId: user.id,
        channelId: msg.variables.assistantChannelId,
        event: 'onboarding/welcome'
      }, 5000)
    }
  }
  return {
    ...params,
    context: setupSubscriptionContext()
  }
}

const startSubscriptionServer = function startSubscriptionServer(httpServer) {
  return new SubscriptionServer({ subscriptionManager, onSubscribe }, httpServer)
}

export default startSubscriptionServer
