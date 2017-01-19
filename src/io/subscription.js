import { PubSub, SubscriptionManager } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from 'schema'
import pubsub from './pubsub'
import { setupFunctions } from 'resolvers/subscriptions'
import logger from './logger'
import { createServer } from 'http'
import { setupSubscriptionContext } from 'middleware/graphql'
import JWT from 'jsonwebtoken'
import { createJob } from 'io/queue'
import User from 'models/User/model'
import { restoreInput } from 'utils/chat'
let server;

export const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions
})

// Sets context for the gql request
// @NOTE See the Subscription schema for user context info
export const onSubscribe = async (msg, params, req) => {
  // Triggers onboarding when an assistant sub starts
  if(msg.type === 'subscription_start' && msg.variables.assistantChannelId) {
    // Verify the JWT
    const verified = JWT.verify(msg.variables.jwt, process.env.JWT_SECRET)
    // The JWT can be outdated so check out the DB
    const { attrs:user } = await User.getAsync(verified.id)
    if(!user.didOnboard) {
      const job = await createJob('chat.event', {
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
