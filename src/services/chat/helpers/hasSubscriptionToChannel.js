import Subscription from '../models/Channel/subscriptionModel'

const hasSubscriptionToChannel =
    async function hasSubscriptionToChannel({ channelId, viewerId: userId }) {
      const subscription = await Subscription.getAsync({ channelId, userId })

      if (subscription) {
        return true
      }
      return false
    }

export default hasSubscriptionToChannel
