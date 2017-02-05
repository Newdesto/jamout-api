import { logger, queue } from 'io'
import Channel from 'services/chat/channel'
import { textRequest } from 'io/apiai'
import { handleAPIAIAction, handleUserAction } from './actions'

// Processes a message sent into an assistant channel. Sends a query to
// API.ai and executes the action handler.
// This only processes text messages - so any other type of message such as
// a song or an image will fail with an error.
queue.process('chat.processMessage', async ({ data }, done) => {
  try {
    logger.debug('Processing chat.processMessage job.')

    const message = data.message
    if (!message) {
      done('No message was attached to the job.')
    }

    // Query for the channel details. This is where cache comes in handy.
    const channel = await Channel.getAsync(message.channelId)

    if (!channel.attrs) {
      // Channel checks are done both before job creation and here.
      return done('Channel does not exist.')
    }

    // Append the channel object to the input.
    message.channel = channel.attrs

    // If there's no text it's something we can't process.
    if (!message.text && !message.action) {
      logger.warning('No text or action value to process.')
      return done('No text or action value to process.')
    }

    if (message.text) {
      // Query API.ai without any additional contexts.
      const apiaiResponse = await textRequest(message.text, {
        contexts: [
          { name: 'authenticated' }
        ],
        sessionId: message.senderId
      })

      // Take the result and fulfill the action
      await handleAPIAIAction(message, apiaiResponse.result)
    } else {
      await handleUserAction(message)
    }


    return done()
  } catch (err) {
    logger.error(err)
    return done(err)
  }
})
