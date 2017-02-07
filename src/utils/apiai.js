import shortid from 'shortid'
import microtime from 'microtime'
import { flatten } from 'lodash'

const convertTextMessage = function convertTextMessage(channelId, speech) {
  const speeches = speech.split('\\n')
  return speeches.map(s => ({
    channelId, // sessionId = userId, both auth and anon
    // isAnon: data.isAnon, // @TODO work anon into context
    text: s,
    senderId: 'assistant',
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString()
  }))
}

const convertImageMessage = function convertImageMessage(channelId, url) {
  return {
    channelId, // sessionId = userId, both auth and anon
    // isAnon: data.isAnon, // @TODO work anon into context
    senderId: 'assistant',
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    attachment: {
      disableInput: false,
      src: url,
      type: 'Image'
    }
  }
}

const convertCustomPayloadMessage = function convertCustomPayloadMessage(channelId, payload) {
  if (payload.jamout) {
    // payload.jamout is an array of messages.
    return payload.jamout.map(message => ({
      ...message,
      channelId,
      senderId: 'assistant',
      id: shortid.generate(),
      timestamp: microtime.nowDouble().toString()
    }))
  }

  return []
}

const convertMessage = function convertMessage(channelId, message) {
  switch (message.type) {
    case 0:
      // Text Message
      return convertTextMessage(channelId, message.speech)
    case 3:
      // Image message
      return convertImageMessage(channelId, message.imageUrl)
    case 4:
      // Custom payload message
      return convertCustomPayloadMessage(channelId, message.payload)
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
const fulfillmentToMessages =
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

export default fulfillmentToMessages
