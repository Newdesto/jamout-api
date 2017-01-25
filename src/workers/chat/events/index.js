// IO
import { logger, queue } from 'io'
import { eventRequest } from 'io/apiai'
import fulfill from '../fulfillments'

/**
 * This worker processes the `chat.events` job which sends an event request to
 * API.ai and routes the response to workers/chat/fulfillments.
 * @type {Object}
 */
queue.process('chat.event', async ({ data: { userId, event, channelId } }, done) => {
  try {
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
    await fulfill({ channelId, userId }, apiaiResponse.result)
    done()
  } catch (err) {
    logger.error(err)
    done(err)
  }
})
