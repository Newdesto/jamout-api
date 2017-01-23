import JWT from 'jsonwebtoken'
import logger from 'io/logger'

export const resolvers = {
  messages(message) {
    return message
  }
}

export const mapper = {
  messages(root, { jwt, channelId }) {
    logger.info('Messages mapper.')
    if (!jwt)
      throw new Error('Authentication failed.')

    // Throws an error if invalid
    const user = JWT.verify(jwt, process.env.JWT_SECRET)
    return {
      messages: {
        channelOptions: { path: [channelId] }
      }
    }
  }
}
