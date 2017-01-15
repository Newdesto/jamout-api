import logger from 'io/logger'
import uuid from 'uuid'
import JWT from 'jsonwebtoken'

export const resolvers = {
  messages(message) {
    return message
  }
}

export const mapper = {
  messages(root, { jwt, channelId }) {
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
