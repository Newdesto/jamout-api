export default {
  async channels(root, args, { user, Chat, logger }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }

      const channels = await Chat.getChannels()

      if (args.excludeAssistant) {
        return channels.filter(c => c.type !== 'a')
      }
      if (args.channelId) {
        return Chat.getChannelById({ channelId: args.channelId })
      }
      return channels
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
