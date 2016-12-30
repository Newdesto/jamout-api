import logger from 'io/logger'
import uuid from 'uuid'

export const resolvers = {
  assistant(assistantEvent) {
    return assistantEvent
  }
}

export const mapper = {
  assistant: (root, { anonId }, { user: { id: userId } = {} }) => {
    if(!userId && !anonId)
      throw new Error('No ID provided.')
    const id = userId || anonId
    logger.debug(`New assistant subscription for user (${id})`)
    return {
        'assistant': {
          channelOptions: { path: [id] },
          filter: assistantEvent => {
            return assistantEvent.userId === id
          }
        }
    }
  }
}
