import { logger, queue, pubsub, apiai } from 'io'
import { textRequest } from 'io/apiai'
import StudioEvent from 'models/StudioEvent'
import { eventRequestAndProcess } from 'utils/assistant'
import Promise from 'bluebird'
import { createJob } from 'io/queue'
import uuid from 'uuid'
import { postbackById } from 'utils/postback'


queue.process('studio-sessions:inquire', async ({ data }, done) => {
  logger.debug(`Creating linear studio session inquiry for (${data.userId})`)
  let { date, studio, time, userId } = data;
  const NewEvent = new StudioEvent()

  if ( date && studio && time && userId ) {
    const inquiry = await NewEvent.createStudioEvent(data.userId, 'new-inquiry', data)
    await eventRequestAndProcess({ name: 'studio-session:inquire--complete' }, { sessionId: userId })
    done(null, inquiry)
  }

  if (!studio) {
    const { response, events } = await eventRequestAndProcess({ name: 'studio-session:inquire--studio' }, { sessionId: userId });
    console.log(events)
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

    const studioInputId = uuid()
    pubsub.publish(`assistant.${userId}`, {
      ...events.input,
      id: studioInputId
    })
    const studioInput = await postbackById(userId, studioInputId)
    console.log(studioInput)
  }

  if (!date) {

  }
  if (!time) {

  }
});
