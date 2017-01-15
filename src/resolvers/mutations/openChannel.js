export default {
  openChannel(root, args, { user, Channel }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    // ChannelType Enum
    const type = {
      DM: 'd',
      GROUP: 'g',
      ASSISTANT: 'a'
    }[args.type]

    return Channel.createChannel(type, args.users)
  }
}
