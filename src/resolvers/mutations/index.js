import iam from 'services/iam/mutations'
import distribution from 'services/distribution/mutations'
import music from 'services/music/mutations'
import generateS3Signature from './generateS3Signature'

const resolvers = {
  Mutation: {
    ...iam,
    ...distribution,
    ...music,
    ...generateS3Signature
  }
}

export default resolvers
