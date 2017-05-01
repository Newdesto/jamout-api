import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const resolvers = {
  async user({ userId }, args, { User }) {
    const user = await User.fetchById(userId)
    return user
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
    const params = { Bucket: 'jamout-music', Key: `${track.artworkKey}` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  }
}

export default resolvers
