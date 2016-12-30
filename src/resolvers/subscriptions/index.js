import { includes, merge } from 'lodash'
import * as assistant from './assistant'

export const setupFunctions = merge(
  assistant.mapper
)

/**
 *   channel: (root, args, context) => {
     console.log(context)
     // query for my channels
     return {
         'chat.channel': {
           channelOptions: { path: ['incr'] }
         }
     }
   }
 */

export const resolvers = {
  Subscription: merge(
    assistant.resolvers,
  )
}
