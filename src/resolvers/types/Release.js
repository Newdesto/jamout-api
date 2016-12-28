import ReleaseTrack from './ReleaseTrack'
import ReleaseType from './ReleaseType'
import ReleaseStatus from './ReleaseStatus'
import AWS from 'aws-sdk'
const s3 = new AWS.S3()

// @NOTE Release doesn't have a resolver for tracklist because tracks objects are still
// stored in the object. We just created a separated ReleaseTrack type for organization.

// @TODO Create Enum for status, type, lang, genre, prices?
// @NOTE we allow most nulls bc of the draft system
const Release = `
  type Release {
    id: ID!,
    status: ReleaseStatus!,
    userId: ID!,
    stripeOrderId: String,
    type: ReleaseType!,
    artworkS3Key: String,
    artworkUrl: String,
    title: String,
    artist: String,
    recordLabel: String,
    language: String,
    primaryGenre: String,
    secondaryGenre: String,
    releaseDate: Int,
    albumPrice: Int,
    trackPrice: Int,
    tracklist: [ReleaseTrack!]
  }
`

export const resolver = {
  artworkUrl(release, args, context) {
    if(!release.artworkS3Key)
      return null
    const params = { Bucket: 'jamout-distribution', Key: release.artworkS3Key }
    const url = s3.getSignedUrl('getObject', params)
    return url
  },
  status(release, args, context) {
    return {
      d: 'DRAFT',
      ps: 'PAID_PENDING',
      p: 'PROCESSING',
      ps: 'PROCESSED_SUBMITTED',
      r: 'RELEASED'
    }[release.status]
  },
  type(release, args, context) {
    return {
      s: 'SINGLE',
      e: 'EP',
      a: 'ALBUM'
    }[release.type]
  }
}

export default () => [
  Release,
  ReleaseTrack,
  ReleaseType,
  ReleaseStatus
]
