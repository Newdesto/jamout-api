import AWS from 'aws-sdk'
const s3 = new AWS.S3()

export const resolver = {
  audioUrl(track, args, context) {
    const params = { Bucket: 'jamout-music', Key: `${track.audioKey}` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  },
  artworkUrl(track, args, context) {
    const params = { Bucket: 'jamout-music', Key: `${track.artworkKey}` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  }
}

export default () => [
  Track
]
