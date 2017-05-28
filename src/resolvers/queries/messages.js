import { getMessagesByChannelId } from 'models/Message'
import { eventRequest } from 'io/apiai'
import fulfillmentToMessages from 'utils/apiai'
import { pubsub } from 'io/subscription'
import createMessage from 'services/chat/helpers/createMessage'
import { sortBy, prop } from 'ramda'
import cleanDeep from 'clean-deep'

export default {
  async messages(root, { channelId }, { viewer: { id: viewerId, ...viewer }, logger }) {
    try {
      if (!viewerId) {
        throw new Error('Authentication failed.')
      }

      const messages = await getMessagesByChannelId(channelId)

      // Onboarding trigger
      if (viewerId === channelId && messages.length === 0 && !viewer.didBotWelcome) {
          const { result } = await eventRequest({ name: 'onboarding-welcome' }, {
            contexts: [
                { name: 'authenticated' }
            ],
            sessionId: viewerId
          })

          // Convert the messages to Jamout's format.
          const dirtyMessages = fulfillmentToMessages(channelId, result.fulfillment)
          const messages = cleanDeep(dirtyMessages)

          // Save and publish.
          const createdMessages = await Promise.all(messages.map(m => createMessage(m)))

          const sortByTimestamp = sortBy(prop('timestamp'))
          sortByTimestamp(createdMessages)
            .map(m => pubsub.publish('messages', m))

          return createdMessages
      }
    
      return messages
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
