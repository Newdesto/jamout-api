// IO
import { logger, queue, pubsub, apiai } from 'io'
import { textRequest } from 'io/apiai'

// Connectors
import channelModel from 'models/Channel'
import Message from 'models/Message'
const Channel = new channelModel()

// Input Handlers
import textbox from './textbox'
import onboarding from './onboarding'
const importHandlers = {
  'Textbox': textbox,
  ...onboarding
}

/**
 * This worker processes the `chat.input` job.
 * @type {Object}
 */
queue.process('chat.input', async function chatInputWorker({ id, data: input }, done) {
  try {
    logger.debug('Processing chat.input job.')

    // Query for the channel details. This is where cache comes in handy.
    const channel = await Channel.getById(input.channelId)

    if(!channel) {
      done('Channel does not exist.')
    }

    // Append the channel object to the input.
    input.channel = channel

    // Route it to the proper handler if it was sent a component. If not, just
    // call done. It's a weird use case if we a component-less input gets
    // queued, so just throw a warning.
    if(!input.component) {
      logger.warn(`A chat input was queued for processing but didnt't have a
      component.`)
      return done()
    }

    const importHandler = importHandlers[input.component]

    if (!importHandler) {
      throw new Error(`No handler registered for the component: ${input.component}`)
    }

    await importHandler(input)
    done()
  } catch (e) {
    logger.error(e)
    done(e)
  }
})
