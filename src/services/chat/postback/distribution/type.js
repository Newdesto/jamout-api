import shortid from 'shortid'
import microtime from 'microtime'
import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import format from 'date-fns/format'
import Chat from 'services/chat'
import Release from 'models/Release'

const readableReleaseEnum = {
  SINGLE: 'single',
  EP: 'EP',
  ALBUM: 'album'
}

const dbReleaseEnum = {
  SINGLE: 's',
  EP: 'e',
  ALBUM: 'a'
}

/**
 * Publishes an event message and sends an inquiry message to the
 * studio's assistant channel.
 */
const typeHandler = async function typeHandler({ user, channelId, values }) {
  // Update the EditRelease.Type message to an Event message.
  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      type: 'Event',
      disableInput: false,
      text: `You created a new ${readableReleaseEnum[values.type]} release.`
    }
  })

  // Create or update a release.
  let releaseId = values.releaseId
  if (releaseId) {
    // Update the release.
    await Release.update(releaseId, {
      type: dbReleaseEnum[values.type]
    })
  } else {
    // Create a new release.
    const release = await Release.create({
      userId: user.id,
      type: dbReleaseEnum[values.type]
    })
    releaseId = release.id
  }

  // By now we should for sure have a release. Post a Meta attachment message.
  const metaMessage = {
    channelId,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    senderId: 'assistant',
    attachment: {
      releaseId,
      subtype: 'Meta',
      type: 'EditRelease',
      disableInput: true,
      postbackId: 'EditRelease.Meta'
    }
  }

  // Persist and publish the Meta message.
  await createJob('chat.persistMessage', { message: metaMessage })
  await publishMessages(channelId, 'assistant', [metaMessage])
}

export default typeHandler
