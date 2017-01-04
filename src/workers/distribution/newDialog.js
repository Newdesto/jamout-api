import { logger, queue, pubsub, apiai } from 'io'
import { eventRequestAndProcess } from 'utils/assistant'

queue.process('distribution:new', async ({ data: { userId } }, done) => {
  logger.debug(`Starting nonlinear distribution:new dialog for user (${userId})`)

  const { response, events } = await eventRequestAndProcess({
    name: 'distribution:new::type',
  }, {
    sessionId: userId // user id that is
  })
  
  console.log(events)
  done()
})
