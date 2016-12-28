import { includes, merge } from 'lodash'
import { incr } from 'resolvers/queries'

const channel = {
  channel(channel) {
    // here is where we might check perms and return null
    return channel
  }
}

const subscriptionMapping = {
  channel: (root, args, context) => {
    console.log(context)
    // query for my channels
    return {
        'chat.channel': {
          channelOptions: { path: ['incr'] }
        }
    }
  }
}

export const resolvers = {
  Subscription: merge(
    channel,
  )
}

export const setupFunctions = {
  ...subscriptionMapping
};
