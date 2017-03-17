import 'app-module-path/register'
import { startSubscriptionServer } from 'io/subscription'
import http from 'http'
import 'workers'
import request from 'request'
import { app, logger } from './io'
import { jwt, graphql, graphiql } from './middleware'

logger.info('Starting Jamout API, woohoo!')

const httpServer = http.createServer()

// Temporary platform watch webhook.
app.post('/platform-watch', (req, res) => {
  request.post({
    url: 'https://hooks.slack.com/services/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',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(req.body)
  })
  res.sendStatus(200)
})

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
startSubscriptionServer(httpServer)

logger.info('Binding express app to http server.')
httpServer.on('request', app)
httpServer.listen(3000, () => logger.info('HTTP Server listening on port 3000.'))
