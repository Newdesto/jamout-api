import { publishMessages, publishInput, toggleInput } from 'utils/chat'
import { createJob } from 'io/queue'
import { logger } from 'io'
import R from 'ramda'
import microtime from 'microtime'
import shortid from 'shortid'
import format from 'date-fns/format'

const inquire = async function inquire({ userId, channelId }, result, messages) {
  logger.debug('Processing studio-sessions.inquire action.')
  logger.debug(JSON.stringify(result))
  // Schedule Persistence.
  await Promise.all(messages.map(message => createJob('chat.persistMessage', {
    message
  })))

  // Publish the messages to the channel's pubsub channel
  await publishMessages(channelId, 'assistant', messages)

  // Map contexts
  const contexts = R.indexBy(R.prop('name'), result.contexts)

  // Process the contexts and send the relevant message attachment.
  if (R.has('studio-sessions:inquire_dialog_params_studio')(contexts)) {
    const studiosCardGroup = {
      channelId,
      id: shortid.generate(),
      timestamp: microtime.nowDouble().toString(),
      senderId: 'assistant',
      attachment: {
        type: 'CardGroup',
        disableInput: true,
        action: 'message', // We want to send a message with the studio name.
        cards: [{
          title: 'Studio Circle Recordings',
          subtitle: '863 Woodside Way, San Mateo, CA 94401',
          buttons: [{
            title: 'Select',
            name: 'studio',
            value: 'Studio Circle Recordings',
            action: 'message'
          }]
        }]
      }
    }

    // Persist and publish the studio attachment messages.
    await createJob('chat.persistMessage', { message: studiosCardGroup })
    await publishMessages(channelId, 'assistant', [studiosCardGroup])
  }

  // If the action is complete send the confirmation attachment.
  if (!result.actionIncomplete) {
    // @NOTE that this is going to be a potential fe
    let date
    if (result.parameters.date.defaultDate) {
      date = result.parameters.date.defaultDate
    } else {
      date = result.parameters.date
    }
    const studioInquiry = {
      channelId,
      id: shortid.generate(),
      timestamp: microtime.nowDouble().toString(),
      senderId: 'assistant',
      attachment: {
        type: 'StudioSessionInquiry',
        disableInput: true,
        studio: result.parameters.studio,
        date: format(date)
      }
    }

    // Persist and publish the studio attachment messages.
    await createJob('chat.persistMessage', { message: studioInquiry })
    await publishMessages(channelId, 'assistant', [studioInquiry])
  }
  return messages
}

export default inquire
