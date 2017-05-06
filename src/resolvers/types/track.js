import AWS from 'aws-sdk'
import { zipObj} from 'ramda'

const s3 = new AWS.S3()

const resolvers = {
  privacySetting({ privacySetting }) {
    switch (privacySetting) {
      case 0:
        return 'PRIVATE'
      case 1:
        return 'CONNECTIONS_ONLY'
      case 2:
        return 'PUBLIC'
      default:
        return 'PRIVATE'
    }
  },
  async user({ userId }, args, { User }) {
    const user = await User.fetchById(userId)
    return user
  },
  async featuredUsers({ featuredUserIds }, args, { User }) {
    if (!featuredUserIds) {
      return
    }

    // @TODO Refactor. Is there a better way to handle this?
    const users = await User.fetchByIds(featuredUserIds)
    const realUsers = users.filter(u => !!u)
    const realUsersObject = zipObj(realUsers.map(u => u.id), realUsers)
    const nonUsers = featuredUserIds.filter(id => !realUsersObject[id])
    
    // Fake a user object for non users.
    return [
      ...realUsers,
      ...nonUsers.map(id => ({
        id,
        displayName: id
      }))
    ]
  },
  audioUrl(track) {
    let params
    if (process.env.NODE_ENV !== 'production') {
      params = { Bucket: 'jamout-test-data', Key: `${track.audioKey}` }
    } else {
      params = { Bucket: 'jamout-music', Key: `${track.audioKey}` }
    }
    const url = s3.getSignedUrl('getObject', params)
    return url
  },
  artworkUrl(track) {
    if (!track.artworkKey) {
      return null
    }
    let params
    if (process.env.NODE_ENV !== 'production') {
      params = { Bucket: 'jamout-test-data', Key: `${track.artworkKey}` }
    } else {
      params = { Bucket: 'jamout-music', Key: `${track.artworkKey}` }
    }
    const url = s3.getSignedUrl('getObject', params)
    return url
  }
}

export default resolvers
