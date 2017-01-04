import { logger } from 'io'
import { eventRequest, textRequest } from 'io/apiai'
import { flatten } from 'lodash'

/**
 * Sends an event request to API.ai and processes the response, throwing an error
 * if one exists or converting the fulfillment to AssistantEvent objects.
 * @param  {object} event   See https://docs.api.ai/docs/query#post-query
 * @param  {object} options See https://docs.api.ai/docs/query#post-query
 * @return {object}         Returns a object with the response, events, contexts, etc.
 */
export async function eventRequestAndProcess(event, options) {
  try {
    const response = await eventRequest(event, options)
    const events = mapResponseToEvents(response)
    return {
      response,
      events
    }
  } catch(e) {
    logger.error(e)
    throw e
  }
}

// Maps an API.ai response to the correct assistant events. If an error is
// returned from API.ai it throws an Error.
function mapResponseToEvents(response) {
  const { status, result, sessionId } = response
  // lets check for those error shall we
  if(status.code !== 200)
    throw new Error(status.errorDetails)

  if(status.code == 200 && status.errorType === 'deprecated')
    logger.warn('API.ai responded with a warning about a deprecated feature!')

  // Map rich messages to AssistantMessage objects.
  const messages = mapRichMessages(result.fulfillment.messages, sessionId, result.contexts)

  // Map redirect parameter to AssistantRedirect object
  // @NOTE: Redirect values returned may have variable string embedded.
  // (e.g.; /distribution/release/edit/${id})
  let redirect;
  if(result.parameters.redirect) {
    redirect = {
      type: 'redirect',
      route: result.parameters.redirect
    }
  }

  // @TODO Map UI parameters to AssistantUiUpdate object

  // return the original response + mapped events
  return {
    messages,
    redirect
  }
}

// @TODO check if API.ai returns null or empty array for no contexts
function mapRichMessages(messages, sessionId, contexts) {
  if(!sessionId  || !contexts)
    throw new Error('Session ID to map API.ai messages')

  const mapped =  messages.map(m => {
    console.log(m.type)
    switch(m.type) {

      // text message
      case 0:
        // split by line break
        const speeches = m.speech.split('\\n')
        return speeches.map(s => ({
          type: 'message.text',
          userId: sessionId, // sessionId = userId, both auth and anon
          //isAnon: data.isAnon, // @TODO work anon into context
          sender: 'a',
          text: s,
          contexts
        }))
      // log an error
      default:
        logger.error('Failed to match the API.ai message type.')
        return

    }
  })

  return flatten(mapped)
}
