import iam from 'gql/services/iam/queries'
import music from 'gql/services/music/queries'
import distribution from 'gql/services/distribution/queries'
import node from './node'

const resolvers = {
  Query: {
    ...node,
    ...iam,
    ...music,
    ...distribution
  }
}

export default resolvers
