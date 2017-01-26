import { logger } from 'io'
import { createJob } from 'io/queue'
import { fulfillmentToMessages } from 'utils/apiai'
import Promise from 'bluebird'
import { publishMessages } from 'utils/chat'
import onboarding from './onboarding'

const actionFunctions = {
  ...onboarding
}

/**
 * Parses API.ai's result and handles any logic and publishing.
 * @param  {Object}  result API.ai result (https://docs.api.ai/docs/query#response)
 * @return {Promise}          [description]
 */
const fulfill = async function fulfill(input, result) {
  // Convert the messages to Jamout's format.
  const messages = fulfillmentToMessages(input.channelId, result.fulfillment)

  // If no action was returned that means there's no logic to carry out,
  // so just persist, publish and dip.
  if (!result.action) {
    // Persist the messages in DDB.
    await Promise.all(messages.map(message => createJob('chat.persistMessage', {
      message
    })))

    // Publish the messages to the channel's pubsub channel
    await publishMessages(input.channelId, 'assistant', messages)
    return
  }

  // Get the action function
  const actionFunction = actionFunctions[result.action]

  // If there was an action, but there is no action funcion recognized log an
  // error and default to persistence and publishing.
  if (!actionFunction) {
    logger.error(`No action function set for the action ${result.action}.`)
    // Persist the messages in DDB.
    await Promise.all(messages.map(message => createJob('chat.persistMessage', {
      message
    })))

    // Publish the messages to the channel's pubsub channel
    await publishMessages(input.channelId, 'assistant', messages)
    return
  }

  // Call the action function...
  await actionFunction(input, result, messages)
}

export default fulfill
