import { logger, queue, pubsub, apiai } from 'io'
import { request } from 'io/apiai'

queue.process('assistant.process', async ({ data }, done) => {
  logger.debug(`Processing assistant message from user (${data.userId})`)

  // publish typing.start
  // @NOTE we show the typing indicator for as long as the process takes. A better
  // option would be to display the indicator in correlation with the message length
  pubsub.publish(`assistant.${data.userId}`, {
    __type: 'AssistantTyping',
    createdAt: Date.now(),
    type: 'typing.start',
    userId: data.userId
  })

  // @NOTE we can use API.ai for persisting context for this user's session
  // They expire though, so we need to persist them even after the user leaves

  const response = await request(data.text, { sessionId: data.userId })

  if(response.status.code !== 200) {
    // @TODO fail this job
    logger.error(response)
    done()
    return
  }

  // handle the fulfillment

  pubsub.publish(`assistant.${data.userId}`, {
    __type: 'AssistantTyping',
    createdAt: Date.now(),
    type: 'typing.stop',
    userId: data.userId
  })

  pubsub.publish(`assistant.${data.userId}`, {
    __type: 'AssistantMessage',
    createdAt: Date.now(),
    type: 'message',
    userId: data.userId,
    id: response.id, // @NOTE: this is the persisted message ID
    text: response.result.fulfillment.speech
  })


  done()
})
