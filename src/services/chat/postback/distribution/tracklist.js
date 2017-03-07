import { handleAPIAIAction } from 'workers/chat/actions'
import Chat from 'services/chat'
import { eventRequest } from 'io/apiai'

const tracklistHandler = async function tracklistHandler({ user, channelId, values }) {
  // Let's update the ReleaseTracklist message to  hide the dropzone.
  // Since updateMessage deep merges we can just add a done: true property.
  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      done: true
    }
  })

  // Now we need th rights holders information for this reelase.
  // Trigger an event on API.ai to post the distribution/rights-holder intent.
  const metadataResult = await eventRequest({
    name: 'distribution-rights-holder',
    data: {
      releaseId: values.releaseId
    }
  }, {
    sessionId: user.id
  })

  await handleAPIAIAction({ channelId, senderId: user.id }, metadataResult.result)
}

export default tracklistHandler
