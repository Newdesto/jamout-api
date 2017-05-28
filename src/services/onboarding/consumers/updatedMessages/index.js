import Consumer from 'sqs-consumer'
import { eventRequest } from 'io/apiai'
import fulfillmentToMessages from 'utils/apiai'
import { pubsub } from 'io/subscription'
import cleanDeep from 'clean-deep'
import createMessage from 'services/chat/helpers/createMessage'
import { sortBy, prop, flatten } from 'ramda'
import eachSeries from 'async/eachSeries'
import uuid from 'uuid'
import microtime from 'microtime'
import BPromise from 'bluebird'

const nextEvents = {
  '@@jamout/onboarding/welcome/READY_CLICKED': 'onboarding-explanation',
  '@@jamout/onboarding/TeamJamoutConnection/CONNECT_CLICK': 'onboarding-conversational-explanation',
  '@@jamout/onboarding/JamoutCommunityConnection/CONNECT_CLICK': 'onboarding-account-init',
  '@@jamout/onboarding/AccountInit/SOUNDCLOUD_CLICKED': 'onboarding-account-sc-selected',
  '@@jamout/onboarding/AccountInit/MANUAL_CLICKED': ['onboarding-account-manual-selected', 'onboarding-feature-list'],
  '@@jamout/onboarding/ConnectSoundCloud/SUCCESS': 'onboarding-feature-list'
}

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-1.amazonaws.com/533183579694/onboarding-updatedMessages',
  async handleMessage({ Body }, done) {
    try {
      const { message, action } = JSON.parse(Body)
      const nextEvent = nextEvents[action.type]
      if (!nextEvent) {
        return done()
      }

      const events = Array.isArray(nextEvent) ? nextEvent : [nextEvent]
      const multiMessages = await BPromise.map(events, async (event) => {
        const { result } = await eventRequest({ name: event }, {
          contexts: [
                        { name: 'authenticated' }
          ],
          sessionId: message.channelId
        })

                // Convert the messages to Jamout's format.
        const dirtyMessages = fulfillmentToMessages(message.channelId, result.fulfillment)
        return cleanDeep(dirtyMessages)
      })
      const messages = flatten(multiMessages)


            // Save the messages.
            // Is it okay to call chat directly?
            // Do any services need to know when the bot sends a message?
      const createdMessages = await Promise.all(messages.map(m => createMessage(m)))

            // Publish them.
      const sortByTimestamp = sortBy(prop('timestamp'))
      await new Promise((resolve, reject) => {
        eachSeries(sortByTimestamp(createdMessages), async (message, cb) => {
                // Start typing indicator.
          pubsub.publish('messages', {
            senderId: 'bot',
            channelId: message.channelId,
            id: uuid(),
            createdAt: new Date().toISOString(),
            action: 'typing.start',
            timestamp: microtime.nowDouble().toString()
          })

                // Delay.
          await BPromise.delay(
                (message.messageState && message.messageState.text)
                ? message.messageState.text.trim().replace(/\s+/gi, ' ').split(' ').length * 0.25 * 1000
                : 1000
                )

                // Stop typing indicator.
          pubsub.publish('messages', {
            senderId: 'bot',
            channelId: message.channelId,
            id: uuid(),
            createdAt: new Date().toISOString(),
            action: 'typing.stop',
            timestamp: microtime.nowDouble().toString()
          })

                // Finally publish the message.
          pubsub.publish('messages', message)
          cb()
        }, (err) => {
          if (err) {
            reject(err)
          }
          resolve()
        })
      })

      return done()
    } catch (err) {
      return done(err)
    }
  }
})

app.on('error', (err) => {
  console.error(err)
})

app.start()
