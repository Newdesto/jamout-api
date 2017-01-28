const resolvers = {
  async assistantChannel(root, args, { Chat, logger }) {
    try {
      const channel = await Chat.getAssistantChannel()
      return channel
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}

export default resolvers
