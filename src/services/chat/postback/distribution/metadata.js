import { handleAPIAIAction } from 'workers/chat/actions'
import Chat from 'services/chat'
import Release from 'models/Release'
import { eventRequest } from 'io/apiai'

const metadataHandler = async function metadataHandler({ user, channelId, values }) {
  // Let's up date the ReleaseMeta message to show a metadata summary.
  // Since updateMessage deep merges we can just add a done: true property.
  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      done: true
    }
  })

  // Then update the release. For now we're trusting client data.
  await Release.update(values.releaseId, values.metadata)

  // By now we should for sure have a release and can move onto the metadata.
  // Trigger an event on API.ai to post the distribution/metadata intent.
  const metadataResult = await eventRequest({
    name: 'distribution-artwork',
    data: {
      releaseId: values.releaseId
    }
  }, {
    sessionId: user.id
  })

  await handleAPIAIAction({ channelId, senderId: user.id }, metadataResult.result)
}

export default metadataHandler
