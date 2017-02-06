import shortid from 'shortid'
import microtime from 'microtime'
import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
// import format from 'date-fns/format'
 import Chat from 'services/chat'
// import StudioEvent from 'models/StudioEvent'

const setDateHandler = async function newDateHandler({ user, channelId, values }) {

  const dateMessage = {
    channelId,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    senderId: user.id,
    attachment: {
      type: 'StudioSessionSetDate',
      startDate: values.startDate,
      endDate: values.endDate,
      price: values.price,
      disableInput: true,
      hideButtons: true
    },
    visibleTo: values.visibleTo
  }

  await createJob('chat.persistMessage', { message: dateMessage })
  await publishMessages(channelId, user.id, [dateMessage])

  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      type: 'StudioSessionNewDate',
      disableInput: true,
      hideButtons: true
    }
  })


}

export default setDateHandler
