import logger from 'io/logger'
import uuid from 'uuid'
import JWT from 'jsonwebtoken'

export const resolvers = {
  assistant(assistantEvent) {
    return assistantEvent
  }
}

export const mapper = {
  assistant: (root, { jwt }, context) => {
    if(!jwt)
      throw new Error('Authentication failed.')

    const user = JWT.verify(jwt, process.env.JWT_SECRET)
    logger.debug(`New assistant subscription for user (${user.id})`)
    return {
        'assistant': {
          channelOptions: { path: [user.id] },
          filter: assistantEvent => {
            return assistantEvent.userId === user.id
          }
        }
    }
  }
}
