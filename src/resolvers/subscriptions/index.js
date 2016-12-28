import { includes, merge } from 'lodash'
import { incr } from 'graphql/queries'
const count = {
  count(root, args, context) {
    return incr
  }
}

const subscriptionMapping = {
  count: (root, args, context) => ({
    count: {
      channelOptions: { path: ['incr'] }
    }
  }),
  myChannels: (root, args, context) => {
    console.log(context)
    // query for user's channels
    const myChannels = ['abc', 'def']
    return {
      'chat.channel': {
        filter: channel => includes(myChannels, channel.id)
      }
    }
  }
}

export const resolvers = {
  Subscription: merge(
    count,
  )
}

export const setupFunctions = {
  ...subscriptionMapping
};
