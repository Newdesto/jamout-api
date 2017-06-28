import iam from 'services/iam/queries'
import music from 'services/music/queries'
import node from './node'

const resolvers = {
  Query: {
    ...node,
    ...iam,
    ...music
  }
}

export default resolvers
