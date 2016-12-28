import { PubSub, SubscriptionManager } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from 'schema'
import pubsub from './pubsub'
import { setupFunctions } from 'resolvers/subscriptions'
import logger from './logger'
import { createServer } from 'http'
let server;

export const altPS = new PubSub()
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub: altPS,
  setupFunctions
})

// sets context for the gql request
const onSubscribe = async (msg, params, req) => {
  return {
    ...params,
    context: { hello: 'world' }
  }
}

const websocketServer = createServer((request, response) => {
  response.writeHead(404);
  response.end();
});

websocketServer.listen(3005, () => console.log( // eslint-disable-line no-console
  `Websocket Server is now running on port 3005`
))

export default httpServer => {
  if(server)
    return

  logger.info('Mounting subscriptions server.')
  new SubscriptionServer({
    subscriptionManager,
    onSubscribe
  }, websocketServer)
}
