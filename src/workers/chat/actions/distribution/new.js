import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import { deleteContextByName, addContexts } from 'io/apiai'
import { logger } from 'io'
import R from 'ramda'

const newDistro = async function newDistro({ senderId, channelId }, result, messages) {
  logger.debug('Processing distribution/new action.')

  // Schedule persistence of the API.ai response messages.
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  if (!R.isEmpty(result.parameters['release-type']) && R.isEmpty(result.parameters.title)) {
    // The type slot was filled, but the title slot wasn't.
    // Delete the type context and add the title context.
    await deleteContextByName('distribution/new:type', senderId)
    await addContexts([
      {
        name: 'distribution/new:title',
        lifespan: 1
      }
    ], senderId)
  } else if (R.isEmpty(result.parameters['release-type']) && !R.isEmpty(result.parameters.title)) {
    // The title slot was filled, but the type slot wasn't.
    // Leave the default context slot.
  } else if (!R.isEmpty(result.parameters['release-type']) && !R.isEmpty(result.parameters.title)) {
    // Both slots were filled, set the artist context and remove the type context.
    await deleteContextByName('distribution/new:type', senderId)
    await addContexts([
      {
        name: 'distribution/new:artist',
        lifespan: 1
      }
    ], senderId)
  }

  // Publish the messages to the channel's pubsub channel
  await publishMessages(channelId, 'assistant', messages)
  return messages
}

export default newDistro
