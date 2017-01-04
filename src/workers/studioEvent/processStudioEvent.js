import { logger, queue, pubsub, apiai } from 'io'
import { textRequest } from 'io/apiai'
import StudioEvent from 'models/StudioEvent'

queue.process('studio-sessions:inquire', async ({ data }, done) => {
  logger.debug(`Creating studio session inquiry for (${data.userId})`)
  const NewEvent = new StudioEvent()
  const inquiry = await NewEvent.createStudioEvent(data.userId, 'new-inquiry', data)

  done(null, inquiry)
});
