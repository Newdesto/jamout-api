import { graphiqlExpress } from 'graphql-server-express'

export default graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: 'ws://localhost:3000/subscriptions'
})
