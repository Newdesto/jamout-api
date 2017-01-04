import { logger, queue, pubsub, apiai } from 'io'
import AssistantMessage from 'models/AssistantMessage'
import { textRequest } from 'io/apiai'
import { createJob } from 'io/queue'

queue.process('assistant.processMessage', async ({ data }, done) => {
  logger.debug(`Processing assistant message from user (${data.userId})`)
  const amConnector = new AssistantMessage()

  // publish typing.start
  // @NOTE we show the typing indicator for as long as the process takes. A better
  // option would be to display the indicator in correlation with the message length
  pubsub.publish(`assistant.${data.userId}`, {
    createdAt: Date.now(),
    type: 'typing.start',
    userId: data.userId
  })

  // @NOTE we can use API.ai for persisting context for this user's session
  // They expire though, so we need to persist them even after the user leaves

  const response = await textRequest(data.text, { sessionId: data.userId })

  if(response.status.code !== 200) {
    // @TODO fail this job
    logger.error(response)
    done()
    return
  }

  // persist the message - we can fork this into another job if needed
  const amPersisted = await amConnector.create({
    userId: data.userId,
    isAnon: data.isAnon, // is the userId an anonId
    sender: 'a', // a = assistant, u = user
    text: response.result.fulfillment.speech,
    contexts: response.result.context
  })
  amPersisted.type = 'message.text'
  pubsub.publish(`assistant.${data.userId}`, {
    createdAt: Date.now(),
    type: 'typing.stop',
    userId: data.userId
  })
  console.log(amPersisted)
  pubsub.publish(`assistant.${data.userId}`, amPersisted)

  // checks if the action is complete
  // adds user id to parameters
  if (!response.result.actionIncomplete) {
    const { action, parameters } =  response.result;
    await createJob(action, {
      ...parameters,
      userId: response.sessionId
    });
  }

  done()
})
