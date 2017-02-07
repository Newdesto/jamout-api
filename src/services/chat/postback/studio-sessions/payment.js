import shortid from 'shortid'
import microtime from 'microtime'
import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import Stripe from 'stripe'
// import format from 'date-fns/format'
// import Chat from 'services/chat'
import StudioEvent from 'models/StudioEvent'
import Chat from 'services/chat'

const stripe = Stripe(process.env.STRIPE_SECRET)

const paymentHandler = async function paymentHandler({ user, channelId, values }) {
  // Charge the user's card:
  const charge = await stripe.charges.create({
    amount: Number(values.price * 100),
    currency: 'usd',
    description: 'Studio Session',
    source: values.stripeToken
  })

  if (!charge || charge.status !== 'succeeded') {
    console.error('error')
  }

  const nextEvent = await StudioEvent.createStudioEvent(user, 'session planned', {
    userId: user.id,
    studioId: 'studio-circle-recordings',
    studio: 'studio circle',
    startDate: values.startDate,
    endDate: values.endDate,
    type: 'artist paid',
    sessionId: values.sessionId,
    price: values.price
  })
  if (!nextEvent) {
    console.error('shit gg')
  }

  const paidMessage = {
    channelId,
    id: shortid.generate(),
    timestamp: microtime.nowDouble().toString(),
    senderId: user.id,
    attachment: {
      type: 'StudioSessionPaid',
      disableInput: false,
      hideButtons: false,
      startDate: values.startDate,
      endDate: values.endDate,
      sessionId: values.sessionId,
      price: values.price
    }
  }
  await createJob('chat.persistMessage', { message: paidMessage })
  await publishMessages(channelId, user.id, [paidMessage])

  await Chat.updateMessage({
    channelId,
    timestamp: values.thisMessageStamp,
    attachment: {
      type: 'StudioSessionNewDate',
      disableInput: true,
      hideButtons: true
    }
  })
  await Chat.updateMessage({
    channelId,
    timestamp: values.dateMessageStamp,
    attachment: {
      type: 'StudioSessionNewDate',
      disableInput: true,
      hideButtons: true
    }
  })
}

export default paymentHandler
