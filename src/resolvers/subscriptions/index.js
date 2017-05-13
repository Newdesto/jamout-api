import merge from 'lodash/merge'
import * as messages from './messages'

export const setupFunctions = merge(
  messages.mapper
)

export const resolvers = {
  Subscription: merge(
    messages.resolver
  )
}
