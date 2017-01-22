const resolvers = {
  async assistantChannel(root, args, { Chat, logger }) {
    try {
      const channel = await Chat.getAssistantChannel()
      return channel
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}

export default resolvers
