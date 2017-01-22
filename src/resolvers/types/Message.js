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
  async sender({ senderId }, args, { Profile } ) {
    return Profile.fetchById(senderId)
  }
}

export default () => [
  Message,
  Profile
]
