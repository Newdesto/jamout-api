import { createCustomer, createSubscription } from 'utils/stripe'
import User from '../models/User/model'

const upgradeToPremium = async function upgradeToPremium(root, { token }, context) {
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
    token,
    customer: viewer.id,
    plan: 'artist-premium'
  })

  return viewer
}

export default upgradeToPremium
