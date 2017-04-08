const resolvers = {
  type({ type }) {
    return {
      a: 'ASSISTANT',
      d: 'DM',
      g: 'GROUP'
    }[type]
  },
  async avatar(channel, args, { currentUser, User }) {
    // Use the channel ID + name
    if (channel.name) {
      const initial = channel.name.charAt(0)
      const hash = channel.id.replace(/\W/g, '')
      return `https://tiley.herokuapp.com/avatar/${hash}/${initial}.png?s=55`
    }

    // Use a random user's name + id
    const users = await User.fetchByIds(channel.users)
    const random = users
        .filter(u => currentUser.id !== u.id)[0]
    const initial = random.displayName.charAt(0)
    const hash = random.id.replace(/\W/g, '')
    return `https://tiley.herokuapp.com/avatar/${hash}/${initial}.png?s=100`
  },
  async name(channel, args, { currentUser, User }) {
    // If there is a name set, use that.
    if (channel.name) {
      return channel.name
    }

    // No names is set so we build one using the profile names of all users.
    const users = await User.fetchByIds(channel.users)
    return users
      .filter(u => currentUser.id !== u.id) // Filter out current user.
      .map(u => u.displayName) // Map the display names
      .join(', ') // Join with a comma, bro.
  },
  async lastMessage(channel, args, { Chat }) {
    const lastMessage = await Chat.getMessagesByChannelId({
      channelId: channel.id,
      limit: 1
    })
    return lastMessage[0]
  },
  async messages(channel, args, { Chat }) {
    console.log(channel)
    const messages = await Chat.getMessagesByChannelId({
      channelId: channel.id,
      limit: args.messageLimit
    })

    return messages
  },
  users(channel, args, { User }) {
    return User.fetchByIds(channel.users)
  }
}

export default resolvers
