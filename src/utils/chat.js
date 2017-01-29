import logger from 'io/logger'
import { pubsub } from 'io/subscription'
import shortid from 'shortid'
import BPromise from 'bluebird'
import eachSeries from 'async/eachSeries'
import microtime from 'microtime'

/**
 * Publishes typing events and a content message in a channel.
 * @return {[type]} [description]
 */
export const publishMessages = function publishMessages(channelId, senderId, messages) {
  if (!channelId || !senderId || !messages) {
    throw new Error('Missing one or more arguments.')
  }

  logger.info(`Publishing message to the channel ${channelId}`)

  return new Promise((resolve, reject) => {
    eachSeries(messages, async (m, cb) => {
      logger.info(`Publishing message: ${JSON.stringify(m)}`)
      // If the message is not a text message publish it and callback.
      if (!m.text) {
        pubsub.publish('messages', {
          ...m,
          id: shortid.generate(),
          createdAt: new Date().toISOString()
        })
        cb()
      } else {
        pubsub.publish('messages', {
          channelId,
          senderId,
          id: shortid.generate(),
          createdAt: new Date().toISOString(),
          action: 'typing.start',
          timestamp: microtime.nowDouble().toString()
        })
        await BPromise.delay(m.text.trim().replace(/\s+/gi, ' ').split(' ').length * 0.25 * 1000)
        pubsub.publish('messages', {
          channelId,
          senderId,
          id: shortid.generate(),
          createdAt: new Date().toISOString(),
          action: 'typing.stop',
          timestamp: microtime.nowDouble().toString()
        })
        pubsub.publish('messages', {
          ...m,
          id: shortid.generate(),
          createdAt: new Date().toISOString()
        })
        cb()
      }
    }, (err) => {
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
  if (!channelId || !component) {
    logger.error('Missing one or more arguments to publish input.')
    throw new Error('Missing one or more arguments.')
  }

  pubsub.publish('messages', {
    id: shortid.generate(),
    createdAt: new Date().toISOString(),
    channelId,
    metadata,
    senderId: 'assistant',
    action: `input.${component}`,
    timestamp: microtime.nowDouble().toString()
  })
}

/**
 * Sends a message to disable or enable the input for a given channel.
 */
export const toggleInput = function disableInput({ channelId, enable }) {
  if (!channelId || enable === (undefined || null)) {
    logger.error('Missing one or more arguments to toggle input.')
    throw new Error('Missing one or more arguments.')
  }

  pubsub.publish('messages', {
    id: shortid.generate(),
    createdAt: new Date().toISOString(),
    channelId,
    senderId: 'assistant',
    action: enable ? 'enableInput' : 'disableInput',
    timestamp: microtime.nowDouble().toString()
  })
}
