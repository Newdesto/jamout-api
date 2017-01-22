const resolvers = {
  type({ type }) {
    return {
      a: 'ASSISTANT',
      d: 'DM',
      g: 'GROUP'
    }[type]
  },
  async lastMessage(channel, args, { Message }) {
    const lastMessage = await Chat.getMessagesByChannelId({
      channelId: channel.id,
      limit: 1
    })
    return lastMessage[0]
  },
  async messages(channel, args, { Chat }) {
    const messages =  await Chat.getMessagesByChannelId({
      channelId: channel.id,
      limit: args.messageLimit
    })
  },
  users(channel, args, { Profile }) {
    return Profile.fetchByIds(users)
  }
}

export default resolvers
