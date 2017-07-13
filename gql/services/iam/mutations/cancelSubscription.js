import { cancelSubscription as cancelSubscriptionUtil } from 'gql/utils/stripe'

const cancelSubscription = async function cancelSubscription(root, { atPeriodEnd, subscriptionId }, context) {
  const viewer = context.viewer
  if (!viewer.stripeCustomerId || !subscriptionId) {
    return viewer
  }
  await cancelSubscriptionUtil({ subscriptionId, atPeriodEnd })

  return viewer
}

export default cancelSubscription
