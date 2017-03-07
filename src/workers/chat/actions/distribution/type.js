import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import { deleteContextByName, addContexts } from 'io/apiai'
import { logger } from 'io'
import R from 'ramda'

const type = async function type({ senderId, channelId }, result, messages) {
  logger.debug('Processing distribution/new:type action.')
  console.log(result)
  // Schedule persistence of the API.ai response messages.
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Map contexts
  const contexts = R.indexBy(R.prop('name'), result.contexts)
  console.log(JSON.stringify(contexts.release.parameters.title))
  // If the title was set in the initial intent delete the title context and
  // add the artist context.
  if (!R.isEmpty(contexts.release.parameters.title)) {
    // The type slot was filled, but the title slot wasn't.
    // Delete the type context and add the title context.
    await deleteContextByName('distribution/new:title', senderId)
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

export default type
