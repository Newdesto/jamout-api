import merge from 'lodash/merge'
import channels from './channels'
import messages from './messages'
import {
  Channel,
  Message,
  Profile
} from '../types'

const Query = `
  type Query {
    channels(messageLimit: Int): [Channel!]!,
    messages(channelId: ID!, limit: Int): [Message!]!,
    releases: [Release!]!
  }
`

export const resolvers = {
  Query: merge(
    channels,
    messages
  )
}

export default () => [
  Query,
  Channel,
  Message
]
