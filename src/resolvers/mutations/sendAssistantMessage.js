import logger from 'io/logger'
import { createJob } from 'io/queue'

const resolvers = {
  // @NOTE the default user value so we can destructure for the ID if it exists
  async sendAssistantMessage(root, { anonId, input }, { user: { id: userId } = {}, AssistantMessage }) {
    // @TODO decide if we should store messages not attached to an
    // anonymous or an identified user
    if(!anonId && !userId) {
      logger.error('No ID was passed.')
      throw new Error('No ID was passed.')
    }

    // We give the userId priority
    const message = await AssistantMessage.create({
      userId:  userId || anonId,
      isAnon:  !userId ? true : undefined, // undefined bc storage
      sender: 'u',
      text: input.text,
      type: 'message.text'
    })

    // queue the assistant job
    try {
      const job = await createJob('assistant.processMessage', {
        ...message,
        title: `Process assistant message sent from user (${userId || anonId})`
      })
    } catch(e) {
      // If the job creation fails we don't want to persist the message
      // as it will show up in the conversation history and remind the user
      // of terrible times. :(
      logger.error(e)
      // @TODO destroy message
      throw new Error('Message failed to send. Try again.')
    }

    return message
  }
}

export default resolvers
