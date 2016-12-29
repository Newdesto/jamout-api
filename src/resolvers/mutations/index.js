import merge from 'lodash/merge'
import generateS3Signature from './generateS3Signature'
import openChannel from './openChannel'
import sendMessage from './sendMessage'
import release from './release'
import signUp from './signUp'
import studioEvent from './studioEvent'
import {
  Channel,
  ChannelType,
  Message,
  Release,
  ReleaseInput,
  StudioEvent,
  StudioEventInput,
} from '../types'

const Mutation = `
  type Mutation {
    login(email: String!, password: String!): String!,
    signUp(email: String!, username: String!, password: String!): String!
    generateS3Signature(stringToSign: String!, datetime: String!): String!,
    openChannel(type: ChannelType!, users: [ID!]!): Channel,
    sendMessage(channelId: ID!, text: String!): Message,
    createRelease(input: ReleaseInput!): Release
    updateRelease(id: ID!, input: ReleaseInput!): Release,
    deleteRelease(id: ID!): ID!,
    payForRelease(id: ID!, stripeToken: String!, saveSource: Boolean!): Release,
    createStudioEvent(currentEventId:ID, nextEvent: StudioEventInput): StudioEvent,
  }
`

export const resolvers = {
  Mutation: merge(
    signUp,
    generateS3Signature,
    openChannel,
    sendMessage,
    release,
    studioEvent,
  )
}

export default () => [
  Mutation,
  Channel,
  ChannelType,
  Message,
  Release,
  ReleaseInput,
  StudioEvent,
  StudioEventInput,
]
