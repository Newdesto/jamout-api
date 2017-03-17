import 'app-module-path/register'
import { startSubscriptionServer } from 'io/subscription'
import http from 'http'
import 'workers'
import request from 'request'
import { app, logger } from './io'
import { jwt, graphql, graphiql } from './middleware'

const launch = async function launch() {
  logger.info('Starting Jamout API, woohoo!')

  // Init DDB if dev env.
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    const ddb = require('io/ddb')
    logger.info('Starting dynalite.')
    await ddb.startDynalite()
    logger.info('Dynalite started on port 4567.')
    logger.info('Creating tables in Dynalite.')
    const tables = await ddb.createTables()
    logger.info('Created tables in Dynalite.')
    logger.info(tables)
    logger.info('Loading test data into Dynalite.')
    await ddb.loadTestData()
    logger.info('Loaded test data into Dynalite.')
    logger.info('Starting dynamodb-admin.')
    // @TODO Await dynamodb-admin start up.
    // eslint-disable-next-line import/no-extraneous-dependencies, global-require
    require('dynamodb-admin')
  }

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

  // @TODO Promisify this function.
  httpServer.listen(3000, () => {
    logger.info('HTTP Server listening on port 3000.')
    logger.info('Jamout API is ready to rock!')
  })
}

launch()
