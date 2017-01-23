import { logger } from 'io'
import { textRequest } from 'io/apiai'
import { flatten, omitBy, mapValues } from 'lodash'
import shortid from 'shortid'
import microtime from 'microtime'

/**
 * Converts an array of API.ai messages to message objects we can persist
 * and publish.
 * @param  {Array} fulfillments Array of API.ai message objects (https://docs.api.ai/docs/query#section-message-objects)
 * @return {Array}              Array of Jamout message objects.
 */
export const fulfillmentToMessages = function fulfillmentToMessages(channelId, { speech, messages }) {
  if (!channelId) {
    throw new Error('No channel ID provided.')
  }

  // If no speech and message objects were given just return an empty array.
  if ((!messages || messages.length === 0) && !speech) {
    return []
  }

  // If there are no message objects just convert the speech fulfillment
  // and return the single item array.
  if(!messages || messages.length === 0) {
    // Returns an array by default.
    return convertTextMessage(channelId, speech)
  }

  // Convert all the message objects and return them.
  return flatten(messages.map(m => convertMessage(channelId, m)))
}

const convertMessage = function convertMessage(channelId, message) {
  switch(message.type) {
    case 0:
      // Text Message
      return convertTextMessage(channelId, message.speech)
      break
    case 3:
      return convertImageMessage(channelId, message.imageUrl)
      break
    default:
     throw new Error('API.ai message type not recognized.')
  }
}

const convertTextMessage = function convertTextMessage(channelId, speech) {
  const speeches = speech.split('\\n')
  return speeches.map(s => ({
    channelId, // sessionId = userId, both auth and anon
    //isAnon: data.isAnon, // @TODO work anon into context
    text: s,
    senderId: 'assistant',
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString()
  }))
}

const convertImageMessage = function convertImageMessage(channelId, url) {
  return {
    channelId, // sessionId = userId, both auth and anon
    //isAnon: data.isAnon, // @TODO work anon into context
    senderId: 'assistant',
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    attachment: {
      url,
      type: 'image'
    }
  }
}


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
    //const strippedResponse = stripEmptyParameters(response)
    //const events = mapResponseToEvents(strippedResponse)
    return {
      response
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
    //const strippedResponse = stripEmptyParameters(response)
    //const events = mapResponseToEvents(strippedResponse)

    return response
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
  const input = result.parameters.input && { type: 'input', userId: sessionId, input: result.parameters.input, inputHint: result.parameters.inputHint }

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
    senderId: 'assistant',
    text: s,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
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
          userId: sessionId, // sessionId = userId, both auth and anon
          //isAnon: data.isAnon, // @TODO work anon into context
          senderId: 'assistant',
          text: s,
          id: shortid.generate(),
          timestamp: microtime.nowDouble().toString(),
          contexts
        }))

      // card message
      case 1:
        return {
          ...m,
          userId: sessionId,
          senderId: 'assistant',
          id: shortid.generate(),
          timestamp: microtime.nowDouble().toString(),
          contexts
        }

      // image message
      case 3:
        return {
          userId: sessionId,
          senderId: 'assistant',
          id: shortid.generate(),
          timestamp: microtime.nowDouble().toString(),
          attachment: {
            type: 'image',
            url: m.imageUrl
          }
        }

      // log an error
      default:
        logger.error('Failed to match the API.ai message type.')
        return

    }
  })

  return flatten(mapped)
}
