import { logger } from 'io'
import { createJob } from 'io/queue'
import fulfillmentToMessages from 'utils/apiai'
import Promise from 'bluebird'
import { publishMessages } from 'utils/chat'
import studioSessions from './studio-sessions'
import distribution from './distribution'

const actionHandlers = {
  ...distribution,
  ...studioSessions
}

/**
 * Parses API.ai's result and handles any logic and publishing.
 * @param  {Object}  result API.ai result (https://docs.api.ai/docs/query#response)
 * @return {Promise}          [description]
 */
export const handleAPIAIAction = async function handleAPIAIAction(message, result) {
  console.log(JSON.stringify(result))
  // Convert the messages to Jamout's format.
  const messages = fulfillmentToMessages(message.channelId, result.fulfillment)

  // If no action was returned that means there's no logic to carry out,
  // so just persist, publish and dip.
  if (!result.action) {
    // Persist the messages in DDB.
    await Promise.all(messages.map(m => createJob('chat.persistMessage', {
      message: m
    })))

    // Publish the messages to the channel's pubsub channel
    await publishMessages(message.channelId, 'assistant', messages)
    return
  }

  // Get the action function
  const actionHandler = actionHandlers[result.action]

  // If there was an action, but there is no action funcion recognized log an
  // error and default to persistence and publishing.
  if (!actionHandler) {
    // Things like smalltalk and gretings don't have a fulfillment handler.
    logger.info(`No action handler set for the action ${result.action}.`)
    // Persist the messages in DDB.
    await Promise.all(messages.map(m => createJob('chat.persistMessage', {
      message: m
    })))

    // Publish the messages to the channel's pubsub channel
    await publishMessages(message.channelId, 'assistant', messages)
    return
  }

  // Call the action function...
  await actionHandler(message, result, messages)
}

export const handleUserAction = async function handleUserAction(message) {
  if (!message.action) {
    logger.warn('Message is being routed to handleUserAction but has no action value.')
    return
  }

  // Get the action function
  const actionHandler = actionHandlers[message.action]
  if (!actionHandler) {
    logger.warn(`No action handler set for the action ${message.action}.`)
    return
  }

  // Call the action function...
  await actionHandler(message)
}
