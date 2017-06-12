import { updateSubscription, setCard } from 'utils/stripe'
import User from '../models/User/model'

const updatePremium = async function updatePremium(root, { token, autopay, subscriptionId }, context) {
  let viewer = context.viewer
  console.log(subscriptionId)
  console.log(token)
  console.log(autopay)
  if (!viewer.stripeCustomerId) {
    return viewer
  }
  if (token) {
    const stripeCustomer = await setCard(viewer.stripeCustomerId, token)
  }
  if (autopay !== null) {
    const stripeCustomer = await updateSubscription(viewer.stripeCustomerId, subscriptionId, { cancel_at_period_end: autopay })
  }
  return viewer
}

export default updatePremium
