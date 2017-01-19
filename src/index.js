import 'app-module-path/register'
import { app, logger, subscriptionServer, ioReadyPromise } from './io'
import { jwt, graphql, graphiql } from './middleware'
import 'workers'

logger.info('Starting Jamout API, woohoo!')

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
logger.info('Binding web socket server to port 3005.')
subscriptionServer(app)

logger.info('Binding HTTP server to port 3000.')
app.listen(3000, () => logger.info('HTTP Server listening on port 3000.'))
