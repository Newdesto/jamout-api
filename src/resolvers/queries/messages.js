export default {
  async messages(root, { channelId, limit }, { user, Chat }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }
      const messages = await Chat.getMessagesByChannelId({ channelId, limit })
      return messages
    } catch (e) {
      logger.info('Caught errror in messages resolver.')
      logger.error(e)
      throw e
    }
  }
}
