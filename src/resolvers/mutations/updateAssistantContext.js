import { logger, queue } from 'io'
import { createJob } from 'io/queue'

const resolvers = {
  async updateAssistantContext(root, { input }, { user }) {
    logger.debug('Client is updating assistant context.')

    // queue the context processing job
    try {
      const job = await createJob('assistant.processContext', {
        user,
        ...input,
        title: `Process assistant context update from user (${user.id})`
      })
    } catch(e) {
      // Throw an exception. The client should quietly handle the exception - the
      // UX shouldn't be interrupted.
      logger.error(e)
      throw new Error('Context failed to update. Try again.')
    }

    return true
  }
}

export default resolvers
