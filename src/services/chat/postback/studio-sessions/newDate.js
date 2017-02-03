import shortid from 'shortid'
import microtime from 'microtime'
import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
// import format from 'date-fns/format'
// import Chat from 'services/chat'
// import StudioEvent from 'models/StudioEvent'

const newDateHandler = async function newDateHandler({ user, channelId, values }) {
  // Create the response message
  const dateMessage = {
    channelId,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    senderId: user.id,
    attachment: {
      type: 'StudioSessionNewDate',
      disableInput: false,
      hideButtons: false
    },
    visibleTo: values.visibleTo
  }
  await createJob('chat.persistMessage', { message: dateMessage })
  await publishMessages(channelId, user.id, [dateMessage])
}

export default newDateHandler
