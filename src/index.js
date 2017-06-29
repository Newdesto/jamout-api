import 'app-module-path/register'
import http from 'http'
import rollbar from 'rollbar'
import AWS from 'aws-sdk'
import { app, logger } from 'io'
import { jwt, graphql, graphiql } from 'middleware'
import soundcloudImporterConsumers from 'services/soundcloud-importer/consumers'

const launch = async function launch() {
  try {
    logger.info('Starting Jamout API, woohoo!')

    if (process.env.NODE_ENV !== 'production') {
      logger.info('Disabling SSL for the aws-sdk.')
      AWS.config.update({
        sslEnabled: false
      })
    }

    // Init Rollbar error logging
    if (process.env.NODE_ENV === 'production') {
      rollbar.init('96cf2e7c080147fca2c44cd219fac8fc')
      rollbar.handleUncaughtExceptionsAndRejections('96cf2e7c080147fca2c44cd219fac8fc')
    }

    const httpServer = http.createServer()

    // jwt authentication
    logger.info('Mounting JWT authentication.')
    app.use(jwt)

    // graphql
    logger.info('Mounting GraphQL endpoint to /graphql.')
    app.use('/graphql', graphql)

    // graphiql
    if (1 === 1) { //process.env.NODE_ENV !== 'production'
      logger.info('Mounting GraphiQL endpoint to /graphiql.')
      app.use('/graphiql', graphiql)
    }

    logger.info('Binding express app to http server.')
    httpServer.on('request', app)

    // @TODO Promisify this function.
    httpServer.listen(3000, () => {
      logger.info('HTTP Server listening on port 3000.')
      logger.info('Jamout API is ready to rock!')
    })
  } catch (err) {
    logger.error(err)
    logger.error(err.stack)
  }
}

launch()
