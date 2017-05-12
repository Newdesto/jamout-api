import { textRequest } from 'io/apiai'
import { fulfillmentToMessages } from 'utils/apiai'
import { pubsub } from 'io/subscription'
import { createMessage } from 'models/Message'
import { sortBy, prop } from 'ramda'
import cleanDeep from 'clean-deep'

const botSideEffect = async function botSideEffect(message) {
    const { result } = await textRequest(message.initialState.text, {
        contexts: [
            { name: 'authenticated' }
        ],
        sessionId: message.senderId
    })

    // Convert the messages to Jamout's format.
    const dirtyMessages = fulfillmentToMessages(message.channelId, result.fulfillment)
    const messages = cleanDeep(dirtyMessages)
    console.log(JSON.stringify(messages))
    // Save and publish.
    const createdMessages = await Promise.all(messages.map(m => createMessage(m)))
    console.log(JSON.stringify(createdMessages))
    const sortByTimestamp = sortBy(prop('timestamp'))
    sortByTimestamp(createdMessages)
        .map(m => pubsub.publish('messages', m))

    // @TODO Add action handlers as we add more intents.
}

export default botSideEffect