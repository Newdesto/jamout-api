import AWS from 'aws-sdk'

const s3 = new AWS.S3()
const Profile = `
  type Profile {
    createdAt: String!,
    updatedAt: String,
    id: ID!,
    userId: ID!,
    username: String!,
    permalink: String!,
    displayName: String!,
    location: String,
    avatarKey: String,
    avatarUrl: String
  }
`

export const resolver = {
  avatarUrl(profile) {
    const params = { Bucket: 'jamout-profile', Key: `${profile.userId}/avatar.png` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  }
}

export default () => [
  Profile
]
