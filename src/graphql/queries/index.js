import merge from 'lodash/merge'
import channels from './channels'
import messages from './messages'
import release from './release'
import releases from './releases'
import studioEvents from './studioEvents'
import {
  Channel,
  Message,
  Profile,
  Release,
  StudioEvent,
} from '../types'

// @NOTE: We allow the release field to return null for our new distro modal...
// a little weird, but it works
const Query = `
  type Query {
    channels(messageLimit: Int): [Channel!]!,
    messages(channelId: ID!, limit: Int): [Message!]!,
    release(id: ID!): Release,
    releases: [Release!]!,
    studioEvents: [StudioEvent],
  }
`

export const resolvers = {
  Query: merge(
    channels,
    messages,
    release,
    releases,
    studioEvents
  )
}

export default () => [
  Query,
  Channel,
  Message,
  Release,
  StudioEvent,
]
