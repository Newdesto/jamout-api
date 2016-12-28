import AWS from 'aws-sdk'
const s3 = new AWS.S3()

const StudioEvent = `
  type StudioEvent {
    id: ID!,
    userId: ID!,
    username: String,
    studioId: ID!,
    studio: String,
    type: String!,
    startDate: Int,
    endDate: Int,
  }
`
export default () => [
  StudioEvent
]
