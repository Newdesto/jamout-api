import { logger } from 'io'
import { textRequest, eventRequest } from 'io/apiai'
import flatten from 'lodash/flatten'

const convertTextMessage = function convertTextMessage(channelId, speech) {
  const speeches = speech.split('\\n')
  return speeches.map(s => ({
    channelId, // sessionId = userId, both auth and anon
    // isAnon: data.isAnon, // @TODO work anon into context
    senderId: 'assistant',
    text: s
  }))
}

const convertMessage = function convertMessage(channelId, message) {
  switch (message.type) {
    case 0:
      // Text Message
      return convertTextMessage(channelId, message.speech)
    default:
      throw new Error('API.ai message type not recognized.')
  }
}

/**
 * Converts an array of API.ai messages to message objects we can persist
 * and publish.
 * @param  {Array} fulfillments Array of API.ai message objects (https://docs.api.ai/docs/query#section-message-objects)
 * @return {Array}              Array of Jamout message objects.
 */
export const fulfillmentToMessages =
function fulfillmentToMessages(channelId, { speech, messages }) {
  if (!channelId) {
    throw new Error('No channel ID provided.')
  }

  // If no speech and message objects were given just return an empty array.
  if ((!messages || messages.length === 0) && !speech) {
    return []
  }

  // If there are no message objects just convert the speech fulfillment
  // and return the single item array.
  if (!messages || messages.length === 0) {
    // Returns an array by default.
    return convertTextMessage(channelId, speech)
  }

  // Convert all the message objects and return them.
  return flatten(messages.map(m => convertMessage(channelId, m)))
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
    // const strippedResponse = stripEmptyParameters(response)
    // const events = mapResponseToEvents(strippedResponse)
    return {
      response
    }
  } catch (err) {
    logger.error(err)
    throw err
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
    // const strippedResponse = stripEmptyParameters(response)
    // const events = mapResponseToEvents(strippedResponse)

    return response
  } catch (err) {
    logger.error(err)
    throw err
  }
}
