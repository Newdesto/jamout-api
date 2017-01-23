import { pubsub, logger } from 'io'
import uuid from 'uuid'
import Promise from 'bluebird'
import eachSeries from 'async/eachSeries'

/**
 * Publishes typing events and a content message in a channel.
 * @return {[type]} [description]
 */
export const publishMessages = function publishMessages(channelId, senderId, messages) {
  if(!channelId || !senderId || !messages) {
    throw new Error('Missing one or more arguments.')
  }

  return new Promise((resolve, reject) => {
    eachSeries(messages, async (m, cb) => {
      // If the message is not a text message publish it and callback.
      if(!m.text) {
        pubsub.publish(`messages.${channelId}`, {
          ...m,
          id: uuid(),
          createdAt: new Date().toISOString()
        })
        cb()
      } else {
        pubsub.publish(`messages.${channelId}`, {
          channelId,
          senderId,
          id: uuid(),
          createdAt: new Date().toISOString(),
          action: 'typing.start'
        })
        await Promise.delay(m.text.trim().replace(/\s+/gi, ' ').split(' ').length * .25 * 1000)
        pubsub.publish(`messages.${channelId}`, {
          channelId,
          senderId,
          id: uuid(),
          createdAt: new Date().toISOString(),
          action: 'typing.stop'
        })
        pubsub.publish(`messages.${channelId}`, {
          ...m,
          id: uuid(),
          createdAt: new Date().toISOString()
        })
        cb()
      }
    }, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}

/**
 * Publishes a message with the action `input.${component}` in a channel.
 * Sender defaults to assistant since the only channel with more than one input
 * component is assistant.
 * Also, caches the latest input that was sent to the channel.
 * @return {[type]} [description]
 */
export const publishInput = function publishInput(channelId, component, metadata) {
  if(!channelId || !component) {
    logger.error('Missing one or more arguments to publish input.')
    throw new Error('Missing one or more arguments.')
  }

  pubsub.publish(`messages.${channelId}`, {
    id: uuid(),
    createdAt: new Date().toISOString(),
    channelId,
    metadata,
    senderId: 'assistant',
    action: `input.${component}`
  })
}
