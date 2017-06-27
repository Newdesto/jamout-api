import { createCustomer, createSubscription } from 'utils/stripe'
import User from '../models/User'

const planEnum = {
    DISTRIBUTION_PREMIUM: 'distribution-premium'
}

const subscribeToPlan = async function subscribeToPlan(root, { token, planId }, context) {
  let viewer = context.viewer
    // Create a Stripe customer account if they do not have one yet.
  if (!viewer.stripeCustomerId) {
    const stripeCustomer = await createCustomer({
      email: viewer.email,
      description: viewer.id // @TODO figure out if this is good lol
    })

    const { attrs } = await User.updateAsync({
      id: viewer.id,
      stripeCustomerId: stripeCustomer.id
    })

    viewer = attrs
  }

    // Create the subscription.
    // If !token we assume the user is upgrading with
    // a default card.
  await createSubscription({
    source: token,
    customer: viewer.stripeCustomerId,
    plan: planEnum[planId]
  })

  return viewer
}

export default subscribeToPlan
