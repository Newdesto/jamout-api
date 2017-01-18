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

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions
})

// Sets context for the gql request
// @NOTE See the Subscription schema for user context info
const onSubscribe = async (msg, params, req) => {
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

const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

websocketServer.listen(3005, () => logger.info(
  `Websocket Server listening on port 3005.`
))

export default httpServer => {
  if(server)
    return

  new SubscriptionServer({
    subscriptionManager,
    onSubscribe
  }, websocketServer)
}
