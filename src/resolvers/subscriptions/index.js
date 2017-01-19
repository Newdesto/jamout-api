import { includes, merge } from 'lodash'
import * as messages from './messages'

export const setupFunctions = merge(
  messages.mapper
)

export const resolvers = {
  Subscription: merge(
    messages.resolvers
  )
}
