import merge from 'lodash/merge'
import channels from './channels'
import messages from './messages'
import release from './release'
import releases from './releases'
import {
  Channel,
  Message,
  Profile
} from '../types'

const Query = `
  type Query {
    channels(messageLimit: Int): [Channel!]!,
    messages(channelId: ID!, limit: Int): [Message!]!,
    release(id: ID!): Release!,
    releases: [Release!]!
  }
`

export const resolvers = {
  Query: merge(
    channels,
    messages,
    release,
    releases
  )
}

export default () => [
  Query,
  Channel,
  Message
]
