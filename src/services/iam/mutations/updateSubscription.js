import { setCard } from 'utils/stripe'

const updateSubscription = async function updateSubscription(root, { token, subscriptionId }, { viewer }) {
  if (!viewer.stripeCustomerId) {
    return viewer
  }


  await setCard(viewer.stripeCustomerId, token)
  
  return viewer
}

export default updateSubscription
