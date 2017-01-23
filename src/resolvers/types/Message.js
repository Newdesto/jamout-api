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
    try {
      if(senderId === 'assistant') {
        // @TODO Persist assistant profiles in chat service.
        return {
          id: 'assistant',
          createdAt: new Date().toDateString(),
          userId: 'assistant',
          username: 'Jamout Assistant',
          permalink: 'assistant',
          displayName: 'Jamout Assistant',
          location: 'jamout.co',
          avatarKey: null
        }
      }
      return Profile.fetchById(senderId)
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}

export default () => [
  Message,
  Profile
]
