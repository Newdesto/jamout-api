import 'app-module-path/register'
import { app, logger, ioReadyPromise } from './io'
import { jwt, graphql, graphiql } from './middleware'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { onSubscribe, subscriptionManager } from 'io/subscription'
import http from 'http'
import 'workers'
import microtime from 'microtime'
logger.info(microtime.nowDouble())

logger.info('Starting Jamout API, woohoo!')

const httpServer = http.createServer()

// jwt authentication
logger.info('Mounting JWT authentication.')
app.use(jwt)

// graphql
logger.info('Mounting GraphQL endpoint to /graphql.')
app.use('/graphql', graphql)

// graphiql
if (process.env.NODE_ENV !== 'production') {
  logger.info('Mounting GraphiQL endpoint to /graphiql.')
  app.use('/graphiql', graphiql)
}

// setup the ws subscription server
logger.info('Binding web socket server to http server.')
const subscriptionServer = new SubscriptionServer({ subscriptionManager, onSubscribe }, httpServer)

logger.info('Binding express app to http server.')
httpServer.on('request', app)
httpServer.listen(3000, () => logger.info('HTTP Server listening on port 3000.'))
