import { graphiqlExpress } from 'graphql-server-express'

export default graphiqlExpress({
  endpointURL: '/graphql',
})
