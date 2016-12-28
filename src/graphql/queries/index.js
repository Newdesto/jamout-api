import merge from 'lodash/merge'
import channels from './channels'
import messages from './messages'
import release from './release'
import releases from './releases'
import pubsub from 'io/pubsub'
import logger from 'io/logger'
export let incr = 0
const count = {
  count(root, args, context) {
    incr++
    pubsub.publish('count.incr', incr);
    return incr
  }
}
import {
  Channel,
  Message,
  Profile,
  Release
} from '../types'

// @NOTE: We allow the release field to return null for our new distro modal...
// a little weird, but it works
const Query = `
  type Query {
    channels(messageLimit: Int): [Channel!]!,
    messages(channelId: ID!, limit: Int): [Message!]!,
    release(id: ID!): Release,
    releases: [Release!]!
  }
`

export const resolvers = {
  Query: merge(
    count,
    channels,
    messages,
    release,
    releases
  )
}

export default () => [
  Query,
  Channel,
  Message,
  Release
]
