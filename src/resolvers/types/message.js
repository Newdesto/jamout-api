import shortid from 'shortid'

const resolvers = {
  async sender({ senderId }, arg, { User }) {
    // We need to send a static profile if the sender was assistant.
    if (senderId === 'assistant') {
      return {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        id: shortid,
        userId: 'assistant',
        username: 'jamout-assistant',
        permalink: 'assistant',
        displayName: 'Jamout Assistant',
        location: 'jamout.co',
        avatarKey: null,
        avatarUrl: null,
        connections: []
      }
    }
    return User.fetchById(senderId)
  }
}

export default resolvers
