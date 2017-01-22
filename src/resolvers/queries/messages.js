export default {
  async messages(root, { channelId, limit }, { user, Chat }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }
      const messages = await Chat.getMessagesByChannelId({ channelId, limit })
      return messages
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}
