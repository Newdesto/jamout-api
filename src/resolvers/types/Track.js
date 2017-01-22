import AWS from 'aws-sdk'
const s3 = new AWS.S3()

const Track = `
  type Track {
    id: ID!,
    userId: ID!,
    artworkKey: String,
    audioKey: String!,
    type: String!,
    title: String!,
    playCount: Int,
    audioUrl: String,
    artworkUrl: String
  }
`

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
