const resolvers = {
  type({ type }) {
    return {
      a: 'ASSISTANT',
      d: 'DM',
      g: 'GROUP'
    }[type]
  },
  async lastMessage(channel, args, { Message }) {
    const lastMessage = await Message.getMessages(channel.id, 1)
    return lastMessage[0]
  },
  async messages(channel, args, { Message }) {
    return Message.getMessages(channel.id, args.messageLimit)
  },
  users(channel, args, { Profile }) {
    // Filter out the assistant user...
    const users = channel.users.filter(u => u !== 'assistant')
    return Profile.fetchByIds(users)
  }
}

export default resolvers
