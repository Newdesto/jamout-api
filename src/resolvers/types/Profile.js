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
  /**
   * Returns the JWT if the current user is querying their own profile. This
   * is used by subscription functions on the client side since authentication
   * over websockets is hacked together.
   */
  jwt(profile, args, { jwt, user }) {
    if (!user) {
      throw new Error('Authentication failed.')
    } else if (profile.userId !== user.id) {
      return null
    }

    return jwt
  },
  async assistantChannel(profile, args, { user, Chat }) {
    if (!user) {
      throw new Error('Authentication failed.')
    } else if (profile.userId !== user.id) {
      return null
    }
    const channel = await Chat.getAssistantChannel()
    return channel
  },
  avatarUrl(profile, args, context) {
    const params = { Bucket: 'jamout-profile', Key: `${profile.userId}/avatar.png` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  }
}

export default () => [
  Profile
]
