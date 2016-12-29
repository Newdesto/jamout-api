import 'app-module-path/register'
import { app, logger, subscriptionServer } from './io'
import { jwt, graphql, graphiql } from './middleware'

// jwt authentication
app.use(jwt)

// graphql
app.use('/graphql', graphql)

// graphiql
if(process.env.NODE_ENV !== 'production') {
  logger.info('Mounting GraphiQL endpoint.')
  app.use('/graphiql', graphiql)
}

// setup the ws subscription server
subscriptionServer(app)

app.listen(3000, () => logger.info('GraphQL Server listening on port 3000.'))
