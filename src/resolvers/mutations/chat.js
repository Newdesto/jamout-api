/**
 * The chat mutation resolvers.
 */

export default {
  openChannel(root, args, { user, Chat, logger }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }

      // Get the ENUM values.
      const type = {
        DM: 'd',
        GROUP: 'g',
        ASSISTANT: 'a'
      }[args.type]

      // Do some name validation.
      if (type === 'a') {
        args.name = 'assistant'
      } else if (type === 'd') {
        delete args.name
      }

      return Chat.createChannel({
        type,
        name: args.name,
        users: args.users
      })
    } catch (e) {
      logger.error(e)
      throw e
    }
  },
  async sendInput(root, { input }, { user, Chat }) {
    // @TODO Create a base resolver to handle try/catch and error handling.
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }

      const message = await Chat.sendInput({ input })
      return message
    } catch (e) {
      logger.error(e)
      throw e
    }
  },
  async postback(root, { input }, { user, Chat }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }

      const job = await Chat.postback({ postback: input })
      return
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}
