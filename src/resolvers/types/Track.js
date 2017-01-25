import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const resolvers = {
  audioUrl(track) {
    const params = { Bucket: 'jamout-music', Key: `${track.audioKey}` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  },
  artworkUrl(track) {
    const params = { Bucket: 'jamout-music', Key: `${track.artworkKey}` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  }
}

export default resolvers
