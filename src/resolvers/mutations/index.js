import iam from 'services/iam/mutations'
import distribution from 'services/distribution/mutations'
import generateS3Signature from './generateS3Signature'
import release from './release'
import track from './track'

const resolvers = {
  Mutation: {
    ...iam,
    ...distribution,
    ...generateS3Signature
  }
}

export default resolvers
