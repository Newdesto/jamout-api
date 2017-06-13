import { deleteSubscription } from 'utils/stripe'
import User from '../models/User/model'

const cancelPremium = async function cancelPremium(root, { subscriptionId }, context) {
  let viewer = context.viewer
  if (!viewer.stripeCustomerId || !subscriptionId) {
    return viewer
  }
  const stripeCustomer = await deleteSubscription(subscriptionId)

  return viewer
}

export default cancelPremium
