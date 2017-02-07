import shortid from 'shortid'
import microtime from 'microtime'
import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
// import format from 'date-fns/format'
import Chat from 'services/chat'

const setDateHandler = async function newDateHandler({ user, channelId, values }) {
  const payMessage = {
    channelId,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    senderId: user.id,
    attachment: {
      type: 'StudioSessionSetDate',
      startDate: values.startDate,
      endDate: values.endDate,
      price: values.price,
      disableInput: false,
      hideButtons: false,
      sessionId: values.sessionId,
      dateMessageStamp: values.timestamp
    },
    visibleTo: values.visibleTo
  }

  await createJob('chat.persistMessage', { message: payMessage })
  await publishMessages(channelId, user.id, [payMessage])

  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      type: 'StudioSessionNewDate',
      disableInput: true,
      hideButtons: false
    }
  })
}

export default setDateHandler
