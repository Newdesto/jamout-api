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

const typeHandler = async function typeHandler({ user, channelId, values }) {
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

  // By now we should for sure have a release. Update the Type message so
  // it's a Meta message.
  // Update the EditRelease.Type message to an Event message.
  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      releaseId,
      subtype: 'Meta',
      type: 'EditRelease',
      disableInput: true,
      postbackId: 'EditRelease.Meta'
    }
  })
}

export default typeHandler
