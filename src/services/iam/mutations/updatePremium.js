import { updateSubscription, setCard } from 'utils/stripe'

const updatePremium = async function updatePremium(root, {
  token, autopay, subscriptionId
}, context) {
  const viewer = context.viewer
  if (!viewer.stripeCustomerId) {
    return viewer
  }
  if (token) {
    await setCard(viewer.stripeCustomerId, token)
  }
  if (autopay !== null) {
    await updateSubscription(viewer.stripeCustomerId, subscriptionId, { cancel_at_period_end: autopay })
  }
  return viewer
}

export default updatePremium
