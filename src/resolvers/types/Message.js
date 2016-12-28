import Profile from './Profile'

const Message = `
  type Message {
    createdAt: String!
    updatedAt: String,
    id: ID!
    channelId: ID!,
    userId: ID!,
    user: Profile!,
    text: String!
  }
`

export const resolver = {
  async user({ userId }, arg, { Profile } ) {
    return Profile.fetchById(userId)
  }
}

export default () => [
  Message,
  Profile
]
