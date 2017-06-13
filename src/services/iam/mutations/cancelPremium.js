import { deleteSubscription } from 'utils/stripe'

const cancelPremium = async function cancelPremium(root, { subscriptionId }, context) {
  const viewer = context.viewer
  if (!viewer.stripeCustomerId || !subscriptionId) {
    return viewer
  }
  await deleteSubscription(subscriptionId)

  return viewer
}

export default cancelPremium
