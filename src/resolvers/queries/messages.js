export default {
  async messages(root, { channelId, limit }, { user, Chat, logger }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }
      const messages = await Chat.getMessagesByChannelId({ channelId, limit })
      return messages
    } catch (err) {
      logger.info('Caught errror in messages resolver.')
      logger.error(err)
      throw err
    }
  }
}
