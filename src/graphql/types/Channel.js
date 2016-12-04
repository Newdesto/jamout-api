import Message from './Message'
import Profile from './Profile'

const Channel = `
  type Channel {
    createdAt: String!
    updatedAt: String,
    id: ID!
    type: String!
    name: String,
    messages: [Message!]!,
    ownerUserId: ID,
    users: [Profile!]!
  }
`

export const resolver = {
  async messages({ id }, args, { Message }) {
    return Message.getMessages(id, args.messageLimit)
  },
  async users(channel, args, { Profile }) {
    return Profile.fetchByIds(channel.users)
  }
}

export default () => [
  Channel,
  Message,
  Profile
]
