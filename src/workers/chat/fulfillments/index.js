import { pubsub } from 'io'
import { fulfillmentToMessages } from 'utils/apiai'
import Message from 'models/Message/model'

/**
 * Parses API.ai's result and handles any logic and publishing.
 * @param  {Object}  result API.ai result (https://docs.api.ai/docs/query#response)
 * @return {Promise}          [description]
 */
const fulfill = async function fulfill(input, result) {
  // Convert the messages to Jamout's format.
  let messages = fulfillmentToMessages(input.channelId, result.fulfillment)

  // If no action was returned that means there's no logic to carry out,
  // so just persist, publish and dip.
  if(!result.action) {
    // Persist the messages in DDB.
    const Items = await Message.createAsync(messages)
    messages = Items.map(i => i.attrs)

    // Publish the messages to the channel's pubsub channel
    messages.forEach(m => pubsub.publish(`messages.${input.channelId}`, m))
  }

  // Split up the namespaced action.
  const actions = result.action.split('.')

  // Route by on base type
  switch(actions[0]) {
    case 'onboarding':
      messages = onboarding(input, result, messages)
      break
    default:
      // If we can't figure out what action to take just persist and publish.
      // Persist the messages in DDB.
      const Items = await Message.createAsync(messages)
      messages = Items.map(i => i.attrs)

      // Publish the messages to the channel's pubsub channel
      messages.forEach(m => pubsub.publish(`messages.${input.channelId}`, m))
  }

  return messages
}

export default fulfill
