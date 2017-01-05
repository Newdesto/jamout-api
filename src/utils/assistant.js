import { logger } from 'io'
import { eventRequest, textRequest } from 'io/apiai'
import { flatten, omitBy, mapValues } from 'lodash'

/**
 * Sends an event request to API.ai and processes the response, throwing an error
 * if one exists or converting the fulfillment to AssistantEvent objects.
 * @param  {Object} event   See https://docs.api.ai/docs/query#post-query
 * @param  {Object} options See https://docs.api.ai/docs/query#post-query
 * @return {Object}         Returns a object with the response, events, contexts, etc.
 */
export async function eventRequestAndProcess(event, options) {
  try {
    const response = await eventRequest(event, options)
    const strippedResponse = stripEmptyParameters(response)
    const events = mapResponseToEvents(strippedResponse)
    return {
      response: strippedResponse,
      events
    }
  } catch(e) {
    logger.error(e)
    throw e
  }
}

/**
 * Sends a text request to API.ai and process the response, throwing an error
 * if one exists or converting the fulfillment to AssistantEvent objects.
 * @param  {String}  text    See https://docs.api.ai/docs/query#post-query
 * @param  {string}  options See https://docs.api.ai/docs/query#post-query
 * @return {Object}          Returns a object with the response, events, contexts, etc.
 */
export async function textRequestAndProcess(text, options) {
  try {
    const response = await textRequest(text, options)
    const strippedResponse = stripEmptyParameters(response)
    const events = mapResponseToEvents(strippedResponse)

    return {
      response: strippedResponse,
      events
    }
  } catch(e) {
    logger.error(e)
    throw e
  }
}

/**
 * Strips empty parameters from the contexts of an API.ai response.
 * @param  {Object} response API.ai response (https://docs.api.ai/docs/query#response)
 * @return {Object}          Stripped API.ai response
 */
function stripEmptyParameters(response) {
  // Strip empty responses
  if(response.result.parameters)
    response.result.parameters = omitBy(response.result.parameters, v => v === '')

  // Strip empty context parameters
  if(response.result.contexts) {
    response.result.contexts = response.result.contexts.map(context => {
      // Strip empty parameters
      context.parameters = omitBy(context.parameters, v => v === '')
      return context
    })
  }

  return response
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

  // API.ai sometimes returns a speech fulfillment without including it in the messages array
  // Prioritize the messages array if it exists.
  let messages;
  if(result.fulfillment.messages && result.fulfillment.messages.length > 0)
    messages = mapRichMessages(result.fulfillment.messages, sessionId, result.contexts)
  else
    messages = mapSpeech(result.fulfillment.speech, sessionId, result.contexts)

  // Map input parameter to AssistantInput object
  // Default to a text input is undefined
  let input;
  if(result.parameters.input)
    input = { type: 'input', input: result.parameters.input }
  else
    input = { type: 'input', input: 'text' }

  // return the original response + mapped events
  return {
    messages,
    input
  }
}

function mapSpeech(speech, sessionId, contexts) {
  if(!sessionId)
    throw new Error('Session ID to map API.ai messages')

  const speeches = speech.split('\\n')
  return speeches.map(s => ({
    type: 'message.text',
    userId: sessionId, // sessionId = userId, both auth and anon
    //isAnon: data.isAnon, // @TODO work anon into context
    sender: 'a',
    text: s,
    contexts
  }))
}

// @TODO check if API.ai returns null or empty array for no contexts
function mapRichMessages(messages, sessionId, contexts) {
  if(!sessionId)
    throw new Error('Session ID to map API.ai messages')

  const mapped =  messages.map(m => {
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

      // card message
      case 1:
        return {
          ...m,
          type: 'message.card',
          userId: sessionId,
          sender: 'a',
          contexts
        }
      // log an error
      default:
        logger.error('Failed to match the API.ai message type.')
        return

    }
  })

  return flatten(mapped)
}
