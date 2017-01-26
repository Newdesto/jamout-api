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

      return channels
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
