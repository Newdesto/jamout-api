import { merge } from 'lodash'
import { makeExecutableSchema } from 'graphql-tools'
import { resolvers as queryResolvers } from 'resolvers/queries'
import { resolvers as mutationResolvers } from 'resolvers/mutations'
import { resolvers as subscriptionsResolvers } from 'resolvers/subscriptions'
import { resolvers as typeResolvers } from 'resolvers/types'
import schema from './schema.gql'
import Mutation from './Mutation.gql'
import Query from './Query.gql'
import Subscription from './Subscription.gql'
import Channel from './Channel.gql'
import ChannelType from './ChannelType.gql'
import Message from './Message.gql'
import Profile from './Profile.gql'
import Release from './Release.gql'
import ReleaseInput from './ReleaseInput.gql'
import ReleaseInputTrack from './ReleaseInputTrack.gql'
import ReleaseStatus from './ReleaseStatus.gql'
import ReleaseTrack from './ReleaseTrack.gql'
import ReleaseType from './ReleaseType.gql'

const typeDefs = [
  schema,
  Mutation,
  Query,
  Subscription,
  Channel,
  ChannelType,
  Message,
  Profile,
  Release,
  ReleaseInput,
  ReleaseInputTrack,
  ReleaseStatus,
  ReleaseTrack,
  ReleaseType
]

export default makeExecutableSchema({
  typeDefs,
  resolvers: merge(queryResolvers, mutationResolvers, subscriptionsResolvers, typeResolvers),
})
