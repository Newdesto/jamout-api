import { PubSub, SubscriptionManager } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from 'schema'
import pubsub from './pubsub'
import { setupFunctions } from 'resolvers/subscriptions'
import logger from './logger'
import { createServer } from 'http'
import { setupSubscriptionContext } from 'middleware/graphql'
let server;

const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions
})

// Sets context for the gql request
// @NOTE See the Subscription schema for user context info
const onSubscribe = async (msg, params, req) => {
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
