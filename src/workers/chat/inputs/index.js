// Connectors
import Channel from 'models/Channel'
import Message from 'models/Message'

// Input Handlers
import textbox from './textbox'

const routeInput = async function routeInput(input) {
  // Query for the channel details. This is where cache comes in handy.
  const channel = await Channel.getById(input.channelId)

  if(!channel) {
    throw new Error('Channel does not exist.')
  }

  // Append the channel object to the input.
  input.channel = channel

  // If there was a message, persist it.
  if(input.message) {
    // Persist the message in DDB + replace the message in the input.
    const message = await Message.create(input.message)
    input.message = message
  }

  // Route it to the proper handler if it was sent a component. If not, just
  // return the message. We check this because we might send a message
  // programmatically.
  if(!input.component) {
    return input.message
  }


  switch(input.component) {
    case 'Textbox':
      return textbox(input)
      break
    default:
      throw new Error(`No handler registered for the component: ${input.component}`)
  }
}

export default routeInput
