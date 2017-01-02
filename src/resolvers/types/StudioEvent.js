import AWS from 'aws-sdk'
const s3 = new AWS.S3()

const StudioEvent = `
  type StudioEvent {
    id: ID!,
    createdAt: String,
    userId: ID!,
    username: String,
    studioId: ID!,
    studio: String,
    type: String!,
    startDate: String,
    endDate: String,
    sessionId: ID!,
  }
`
export default () => [
  StudioEvent
]
