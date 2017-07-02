import iam from 'services/iam/queries'
import music from 'services/music/queries'
import distribution from 'services/distribution/queries'
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
