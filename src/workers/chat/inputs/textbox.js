/**
 * Handles the input value from a Textbox component. If it's intended for a
 * user's assistant we send the text to API.ai for the intent. This is Textbox
 * component handler DOES NOT trigger any events or set any contexts, it's more
 * of a generic handler.
 *
 * @NOTE that currently all input handlers only process input intended
 * for an assistant channel. Group chat assistants, multimedia messages, etc.
 * are still on the @TODO.
 */
import logger from 'io/logger'
import { textRequest } from 'io/apiai'
import fulfill from '../fulfillments'

const textboxHandler = async function textboxHandler(input) {
  // Be sure the channel type is 'a'
  if (input.channel.type !== 'a') {
    logger.warn('Textbox handler received an input not intended for assistant.')
  }

  // Make sure we have a text value or else stuff won't work
  if (!input.values.text) {
    logger.error('No text value was sent from the Textbox component.')
    throw new Error('No text value was sent from the Textbox component.')
  }

  // Query API.ai without any additional contexts.
  const apiaiResponse = await textRequest(input.values.text, {
    contexts: [
      { name: 'authenticated' }
    ],
    sessionId: input.userId
  })

  // Take the result and fulfill the action
  await fulfill(input, apiaiResponse.result)
}

export default textboxHandler
