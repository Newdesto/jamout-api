import ReleaseTrack from './ReleaseTrack'
import ReleaseType from './ReleaseType'
import ReleaseStatus from './ReleaseStatus'

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
