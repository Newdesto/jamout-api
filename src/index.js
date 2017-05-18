import 'app-module-path/register'
import { startSubscriptionServer } from 'io/subscription'
import http from 'http'
import rollbar from 'rollbar'
import { app, logger } from './io'
import { jwt, graphql, graphiql } from './middleware'
import bot from './services/bot'

const launch = async function launch() {
  logger.info('Starting Jamout API, woohoo!')

  // Init Rollbar error logging
  if (process.env.NODE_ENV === 'production') {
    rollbar.init('96cf2e7c080147fca2c44cd219fac8fc')
    rollbar.handleUncaughtExceptionsAndRejections('96cf2e7c080147fca2c44cd219fac8fc')
  }

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

  process.env.REQUEST_TOKEN = 'd47bdd673c76e84643111eea89483e49'
  process.env.LANGUAGE = 'en'
  process.env.PORT = '3000'

  // Temporary platform watch webhook.
  app.use('/recastai', (req, res) => {
    console.log(req)
    bot(req.body, res, (error, success) => {
      if (error) {
        console.log('Error in your bot:', error)
        if (!res.headersSent) { res.sendStatus(400) }
      } else if (success) {
        console.log(success)
        if (!res.headersSent) { res.status(200).json(success) }
      }
    })
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
