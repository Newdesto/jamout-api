import iam from 'services/iam/queries'
import node from './node'

const resolvers = {
  Query: {
    ...node,
    ...iam,
  }
}

export default resolvers
