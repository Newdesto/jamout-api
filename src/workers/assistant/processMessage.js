import { logger, queue, pubsub, apiai } from 'io'
import AssistantMessage from 'models/AssistantMessage'
import { textRequestAndProcess } from 'utils/assistant'
import { createJob } from 'io/queue'
import uuid from 'uuid'
import Promise from 'bluebird'

queue.process('assistant.processMessage', async ({ data: { text, userId } }, done) => {
  logger.debug(`Processing assistant message from user (${userId})`)
  const amConnector = new AssistantMessage()

  // publish typing.start
  // @NOTE we show the typing indicator for as long as the process takes. A better
  // option would be to display the indicator in correlation with the message length
  pubsub.publish(`assistant.${userId}`, {
    createdAt: Date.now(),
    type: 'typing.start',
    userId: userId
  })

  // @NOTE we can use API.ai for persisting context for this user's session
  // They expire though, so we need to persist them even after the user leaves

  const { response, events } = await textRequestAndProcess(text, { sessionId: userId })

  if(response.status.code !== 200) {
    // @TODO fail this job
    logger.error(response)
    done()
    return
  }

  // persist messages
  const jobs = await Promise.all(events.messages.map((message, index) => createJob('assistant.persistMessage', {
      title: `Persist assistant messages for user (${userId})`,
      message,
      userId,
    }, (index * 1000)))) // @NOTE the one second delay bc our write/sec = 1 LOL

    pubsub.publish(`assistant.${userId}`, {
      createdAt: Date.now(),
      type: 'typing.stop',
      userId: userId
    })

  // Publish events to the client.
  // Priority: 1) Messages 2) Redirect 3) UI Updates
  events.messages.forEach(message => {
    // @NOTE we optimistically generate a timestamp and id
    message.createdAt = new Date().toISOString()
    message.id = uuid()
    pubsub.publish(`assistant.${userId}`, message)
  })

  pubsub.publish(`assistant.${userId}`, events.input)
  console.log(response)
  // checks if the action is complete and queues a jov
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
