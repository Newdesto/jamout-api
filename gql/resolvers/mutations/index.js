import iam from 'gql/services/iam/mutations'
import distribution from 'gql/services/distribution/mutations'
import music from 'gql/services/music/mutations'
import generateS3Signature from './generateS3Signature'
import importSoundcloudTracks from './importSoundcloudTracks'

const resolvers = {
  Mutation: {
    ...iam,
    ...distribution,
    ...music,
    ...generateS3Signature,
    importSoundcloudTracks
  }
}

export default resolvers
