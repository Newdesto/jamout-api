export default {
  async channels(root, args, { user, Channel }) {
    if (!user)
      throw new Error('Authentication failed.')

    const channels = await Channel.getChannelsByUserId(user.id)

    if (args.excludeAssistant) {
      return channels.filter(c => c.type !== 'a')
    }

    return Channel.getChannelsByUserId(user.id)
  }
}
