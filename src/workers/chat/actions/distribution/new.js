import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import Release from 'models/Release'
import { logger } from 'io'
import R from 'ramda'
import shortid from 'shortid'
import microtime from 'microtime'

const newDistro = async function newDistro({ senderId, channelId }, result, messages) {
  logger.debug('Processing distribution/new action.')
  console.log(JSON.stringify(result))
  // Schedule persistence of the API.ai response messages.
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  const hasType = !R.isEmpty(result.parameters['release-type'])
  const hasTitle = !R.isEmpty(result.parameters.title)
  const hasBoth = (hasType && hasTitle) || false

  // Create the release if we have params
  let release
  if (hasType || hasTitle) {
    release = await Release.create({
      userId: senderId,
      status: 'd',
      type: !R.isEmpty(result.parameters['release-type']) && result.parameters['release-type'],
      title: (!R.isEmpty(result.parameters.title) && result.parameters.title) || undefined
    })
  }

  // Figure out the attachment tye
  let attachmentType
  if (hasBoth || (hasType && !hasTitle)) {
    attachmentType = 'ReleaseMetadata'
  } else {
    attachmentType = 'ReleaseType'
  }

  const message = {
    channelId,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    senderId: 'assistant',
    attachment: {
      type: attachmentType,
      postbackId: attachmentType,
      disableInput: true,
      releaseId: (release && release.id) || null
    }
  }

  await createJob('chat.persistMessage', { message })
  messages.push(message)

  // Publish the messages to the channel's pubsub channel
  await publishMessages(channelId, 'assistant', messages)
  return messages
}

export default newDistro
