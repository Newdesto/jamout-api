import { createJob } from 'io/queue'
import { eventRequest } from 'io/apiai'
import { logger } from 'io'
import { format, addDays, isEqual, isAfter } from 'date-fns'
import handleAction from 'workers/chat/actions'
import R from 'ramda'

const newDistro = async function newDistro({ senderId, channelId }, result, messages) {
  logger.debug('Processing distribution/new:release-date action.')
  console.log(JSON.stringify(result))

  // What's three weeks from now?
  const threeWeeksFromToday = addDays(new Date(), 21)
  console.log(threeWeeksFromToday.toISOString())
  if (R.isEmpty(result.parameters.releaseDate)) {
    // The releaseDate slot wasn't parsed so trigger the invalid.
    const invalidResult = await eventRequest({
      name: 'release-date-invalid',
      data: {
        date: format(threeWeeksFromToday, 'MMMM Do, YYYY')
      }
    }, {
      sessionId: senderId
    })

    await handleAction({ senderId, channelId }, invalidResult.result)
  }

  // Check whether the date is 3 weeks from today and trigger the right event.
  const releaseDate = new Date(result.parameters.releaseDate)
  console.log(releaseDate.toISOString())
  if (isAfter(releaseDate, threeWeeksFromToday) || isEqual(threeWeeksFromToday, releaseDate)) {
    logger.info('Valid date.')
    // The release date is at least three weeks from today.
    // Trigger the valid release date intent.
    const validResult = await eventRequest({
      name: 'distribution/new:release-date-valid'
    }, {
      sessionId: senderId
    })

    await handleAction({ senderId, channelId }, validResult.result)
  } else {
    logger.info('Invalid date.')
    // The release date is NOT at least three weeks from today.
    // Trigger the invalid release intent.
    const invalidResult = await eventRequest({
      name: 'release-date-invalid',
      data: {
        date: format(threeWeeksFromToday, 'MMMM Do, YYYY')
      }
    }, {
      sessionId: senderId
    })

    await handleAction({ senderId, channelId }, invalidResult.result)
  }

  // There are no messages to publish to the channel, we're just here to trigger
  // an event.
  return messages
}

export default newDistro
