/**
 * The chat mutation resolvers.
 */

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
  },
  async sendInput(root, { input }, { user, createJob, logger, pubsub, Message }) {
    // @TODO Create a base resolver to handle try/catch and error handling.
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }

      // If there was a message, persist it. Some inputs might be message-less.
      if(!input.message) {
        return null
      }

      // Persist the message in DDB.
      const message = await Message.create(input.message)


      // Create a job unless we were explicitly told not to
      // @TODO Send the job ID in the return?
      if(!input.bypassQueue) {
        const job = await createJob('chat.input', input)
      } else {
        // A bypassQueue is set true from the messages feature. So let's just
        // publish the message
        pubsub.publish(`messages.${message.channelId}`, message)
      }

      return message
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}
