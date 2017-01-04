import { logger, queue, pubsub } from 'io'
import { createJob } from 'io/queue'
import { eventRequestAndProcess } from 'utils/assistant'
import Promise from 'bluebird'
import uuid from 'uuid'

queue.process('assistant.processContext', async ({ data }, done) => {
  logger.debug(data.title)
  logger.debug(data)

  // To save a DB call we embed the user profile in the data. Should be safe
  // as we verify the JWT during the mutation resolution. We the user profile
  // is up to date is dependent on how fast the job gets processed.

  // Here we look for important context combinations and act accordingly
  // (e.g.; triggering a welcome message).
  // @NOTE If the process grows it might make more sense to queue more jobs,
  // for now we can do everything synchronously.
  matchWelcomeMessages(data)
  done()
})

async function matchWelcomeMessages({ route, user: { id, welcomedToDistribution } }) {
  if(!welcomedToDistribution && route === '/distribution/releases')
    welcomeToDistribution(id)
}

async function welcomeToDistribution(userId) {
  logger.debug(`Triggering distribution welcome message for user(${userId})`)

  try {
    // It might not be smart to call API.ai for responses we already know, but for the sake
    // of keeping conversations in one place we can sacrifice the network call.
    const { response, events } = await eventRequestAndProcess({
      name: 'distribution:welcome',
    }, {
      sessionId: userId // user id that is
    })

    // persist messages
    const jobs = await Promise.all(events.messages.map((message, index) => createJob('assistant.persistMessage', {
        title: `Persist assistant messages for user (${userId})`,
        message,
        userId,
      }, (index * 1000)))) // @NOTE the one second delay bc our write/sec = 1 LOL

    // Publish events to the client.
    // Priority: 1) Messages 2) Redirect 3) UI Updates
    events.messages.forEach(message => {
      // @NOTE we optimistically generate a timestamp and id
      message.createdAt = new Date().toISOString()
      message.id = uuid()
      pubsub.publish(`assistant.${userId}`, message)
    })
    pubsub.publish(`assistant.${userId}`, events.input)

  } catch(e) {
    // Throw an exception. The client should quietly handle the exception - the
    // UX shouldn't be interrupted.
    // @TODO rollback context??
    console.error(e)
    throw new Error('Context failed to update. Try again.')
  }

}
