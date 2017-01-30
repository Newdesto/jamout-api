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
const inquiryHandler = async function inquiryHandler(input) {
  // Persist and publish the event message.
  const eventMessage = {
    channelId: input.channel.id,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    senderId: 'assistant', // I guess events will always be assistant sent?
    attachment: {
      type: 'Event',
      disableInput: false,
      text: input.values.confirm ?
      `You sent a studio session inquiry to ${input.values.studio}.` :
      `You cancelled a studio session inquiry for ${input.values.studio}.`
    }
  }

  await createJob('chat.persistMessage', { message: eventMessage })
  await publishMessages(input.channelId, 'assistant', [eventMessage])

  // Update the artist's message
  await Chat.updateMessage({
    channelId: input.channelId,
    timestamp: input.values.timestamp,
    attachment: {
      type: 'StudioSessionInquiry',
      disableInput: false,
      studio: input.values.studio,
      date: format(input.values.date),
      hideButtons: true
    }
  })

  // If they confirmed send a message to the studio.
  if (input.values.confirm) {
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
        userId: input.userId,
        date: format(input.values.date)
      }
    }

    await createJob('chat.persistMessage', { message: studioMessage })
    await publishMessages(input.channelId, 'assistant', [studioMessage])
  }
}

export default inquiryHandler
