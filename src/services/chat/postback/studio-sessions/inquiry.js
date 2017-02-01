import shortid from 'shortid'
import microtime from 'microtime'
import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import format from 'date-fns/format'
import Chat from 'services/chat'

/**
 * Publishes an event message and sends an inquiry message to the
 * studio's assistant channel.
 */
const inquiryHandler = async function inquiryHandler({ user, channelId, values }) {
  // Persist and publish the event message.
  const eventMessage = {
    channelId,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    senderId: 'assistant', // I guess events will always be assistant sent?
    attachment: {
      type: 'Event',
      disableInput: false,
      text: values.confirm ?
      `You sent a studio session inquiry to ${values.studio}.` :
      `You cancelled a studio session inquiry for ${values.studio}.`
    }
  }

  await createJob('chat.persistMessage', { message: eventMessage })
  await publishMessages(channelId, 'assistant', [eventMessage])

  // Update the artist's message
  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      type: 'StudioSessionInquiry',
      disableInput: false,
      studio: values.studio,
      date: format(values.date),
      hideButtons: true
    }
  })

  // If they confirmed send a message to the studio.
  if (values.confirm) {
    // We have to get the studio's assistant channel Id
    const chat = new Chat({ userId: 'studio-circle-recordings' })
    const studioChannel = await chat.getAssistantChannel()
    const studioMessage = {
      channelId: studioChannel.id,
      id: shortid.generate(),
      timestamp: microtime.nowDouble().toString(),
      senderId: 'assistant',
      attachment: {
        type: 'StudioSessionInquiry',
        disableInput: false,
        userId: user.id,
        date: format(values.date)
      }
    }

    await createJob('chat.persistMessage', { message: studioMessage })
    await publishMessages(channelId, 'assistant', [studioMessage])
  }
}

export default inquiryHandler
