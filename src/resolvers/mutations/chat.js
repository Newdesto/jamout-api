/**
 * The chat mutation resolvers.
 */
import shortid from 'shortid'
import microtime from 'microtime'

export default {
  openChannel(root, a, { user, Chat, logger }) {
    const args = a
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
    } catch (err) {
      logger.error(err)
      throw err
    }
  },
  async sendMessage(root, { text, channelId }, { user: currentUser, Chat, logger }) {
    try {
      if (!currentUser) {
        throw new Error('Authentication failed.')
      }

      const message = await Chat.sendMessage({ message: {
        text,
        channelId,
        senderId: currentUser.id,
        id: shortid.generate(),
        timestamp: microtime.nowDouble().toString()
      } })

      return message
    } catch (err) {
      logger.error(err)
      throw err
    }
  },
  async sendInput(root, { input }, { user, Chat, logger }) {
    // @TODO Create a base resolver to handle try/catch and error handling.
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }


      const message = await Chat.sendInput({
        input: {
          ...input,
          userId: user.id
        }
      })
      return message
    } catch (err) {
      logger.error(err)
      throw err
    }
  },
  async postback(root, { input }, { user, Chat, logger }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }

      await Chat.postback({ postback: input })
      return
    } catch (err) {
      logger.error(err)
      throw err
    }
  },
  async updateMessage(root, args, { user, Chat, logger }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }

      const message = await Chat.updateMessage(args.input)
      return message
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
