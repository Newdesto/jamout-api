// IO
import { logger, queue, pubsub, apiai } from 'io'
import { eventRequest } from 'io/apiai'
import uuid from 'uuid'
import fulfill from '../fulfillments'

// Connectors
import channelModel from 'models/Channel'
import Message from 'models/Message'
const Channel = new channelModel()


/**
 * This worker processes the `chat.events` job which sends an event request to
 * API.ai and routes the response to workers/chat/fulfillments.
 * @type {Object}
 */
queue.process('chat.event', async function chatEventWorker({ data: { userId, event, channelId } }, done) {
  logger.debug('Processing chat.event job.')

  // Query API.ai without any additional contexts.
  const apiaiResponse = await eventRequest({
    name: event
  }, {
    contexts: [
      { name: 'authenticated' }
    ],
    sessionId: userId
  })

  // Take the result and fulfill the action
  fulfill({ channelId }, apiaiResponse.result)
  done()
})
