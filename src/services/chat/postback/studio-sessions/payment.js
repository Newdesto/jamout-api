import shortid from 'shortid'
import microtime from 'microtime'
import { publishMessages } from 'utils/chat'
import { createJob } from 'io/queue'
import Stripe from 'stripe'
// import format from 'date-fns/format'
// import Chat from 'services/chat'
 import StudioEvent from 'models/StudioEvent'

const stripe = Stripe(process.env.STRIPE_SECRET)

const paymentHandler = async function paymentHandler({ user, channelId, values }) {
  // Charge the user's card:
  const charge = await stripe.charges.create({
    amount: Number(values.price * 100),
    currency: "usd",
    description: "Studio Session",
    source: values.stripeToken,
  })

  if (!charge || charge.status !== 'succeeded') {
    console.log('error')
  }
  
}

export default paymentHandler
