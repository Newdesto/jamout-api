import uuid from 'uuid'
import { pubsub } from 'io'
import { createJob } from 'io/queue'
import Message from 'models/Message/model'
import Promise from 'bluebird'
import eachSeries from 'async/eachSeries';

/**
 * [onboarding description]
 * @param  {ChatInput} input    ChatInput
 * @param  {Object} result   API.ai result.
 * @param {Array}   messages Jamout formatted (non-persisted, non-published) messages.
 * @return {Array}           Persisted messages.
 */
const onboarding = async function onboarding({ channelId }, result, messages) {
  switch (result.action) {
    case 'onboarding.welcome':
      await welcome(channelId, result, messages)
      return
      break
    default:
      throw new Error(`Unrecognized or misrouted actions: ${result.action}`)
  }
}

const welcome = async function welcome(channelId, result, messages) {
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  await new Promise((resolve, reject) => {
    eachSeries(messages, async (m, cb) => {
      pubsub.publish(`messages.${channelId}`, {
        id: uuid(),
        createdAt: new Date().toISOString(),
        channelId,
        senderId: 'assistant',
        action: 'typing.start'
      })
      await Promise.delay(m.text.trim().replace(/\s+/gi, ' ').split(' ').length * .35 * 1000)
      pubsub.publish(`messages.${channelId}`, {
        id: uuid(),
        createdAt: new Date().toISOString(),
        channelId,
        senderId: 'assistant',
        action: 'typing.stop'
      })
      pubsub.publish(`messages.${channelId}`, {
        ...m,
        id: uuid(),
        createdAt: new Date().toISOString()
      })
      cb()
    }, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })

  // Then update the input to onboarding.WelcomeButton
  pubsub.publish(`messages.${channelId}`, {
    id: uuid(),
    createdAt: new Date().toISOString(),
    channelId,
    senderId: 'assistant',
    action: 'input.onboarding.WelcomeButton'
  })

  return messages
}

export default onboarding
