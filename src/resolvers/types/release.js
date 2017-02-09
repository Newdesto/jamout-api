import AWS from 'aws-sdk'

const s3 = new AWS.S3()

// @NOTE Release doesn't have a resolver for tracklist because tracks objects are still
// stored in the object. We just created a separated ReleaseTrack type for organization.

// @TODO Create Enum for status, type, lang, genre, prices?
// @NOTE we allow most nulls bc of the draft system
const resolvers = {
  artworkUrl(release) {
    if (!release.artworkS3Key) { return null }
    const params = { Bucket: 'jamout-distribution', Key: release.artworkS3Key }
    const url = s3.getSignedUrl('getObject', params)
    return url
  },
  status(release) {
    return {
      d: 'DRAFT',
      pp: 'PAID_PENDING',
      p: 'PROCESSING',
      ps: 'PROCESSED_SUBMITTED',
      r: 'RELEASED'
    }[release.status]
  },
  type(release) {
    return {
      s: 'SINGLE',
      e: 'EP',
      a: 'ALBUM'
    }[release.type]
  },
  readableType(release) {
    return {
      s: 'single',
      e: 'EP',
      a: 'album'
    }[release.type]
  }
}

export default resolvers
