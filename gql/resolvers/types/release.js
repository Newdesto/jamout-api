import AWS from 'aws-sdk'

const s3 = new AWS.S3()

// @NOTE Release doesn't have a resolver for tracklist because tracks objects are still
// stored in the object. We just created a separated ReleaseTrack type for organization.

// @TODO Create Enum for status, type, lang, genre, prices?
// @NOTE we allow most nulls bc of the draft system
const resolvers = {

}

export default resolvers
