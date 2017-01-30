import merge from 'lodash/merge'
import { makeExecutableSchema } from 'graphql-tools'
import queryResolvers from 'resolvers/queries'
import mutationResolvers from 'resolvers/mutations'
import { resolvers as subscriptionsResolvers } from 'resolvers/subscriptions'
import typeResolvers from 'resolvers/types'
import scalarResolvers from 'resolvers/scalar'
import schema from './schema.gql'
import scalar from './scalar.gql'
import Mutation from './Mutation.gql'
import Query from './Query.gql'
import Subscription from './Subscription.gql'
import Chat from './Chat.gql'
import User from './User.gql'
import Release from './Release.gql'
import ReleaseInput from './ReleaseInput.gql'
import ReleaseInputTrack from './ReleaseInputTrack.gql'
import ReleaseStatus from './ReleaseStatus.gql'
import ReleaseTrack from './ReleaseTrack.gql'
import ReleaseType from './ReleaseType.gql'
import StudioEvent from './StudioEvent.gql'
import StudioEventInput from './StudioEventInput.gql'
import MusicEvent from './MusicEvent.gql'
import MusicEventInput from './MusicEventInput.gql'
import EventArtist from './EventArtist.gql'
import EventArtistInput from './EventArtistInput.gql'
import UpdateEventArtistInput from './UpdateEventArtistInput.gql'
import track from './track.gql'
import updatedTrack from './updatedTrack.gql'
import Connection from './Connection.gql'
import UpdateUserInput from './UpdateUserInput.gql'

// @TODO combine schemas by module (e.g.; combine all release defs)
const typeDefs = [
  schema,
  scalar,
  Mutation,
  Query,
  Subscription,
  Chat,
  User,
  Release,
  ReleaseInput,
  ReleaseInputTrack,
  ReleaseStatus,
  ReleaseTrack,
  ReleaseType,
  StudioEvent,
  StudioEventInput,
  MusicEvent,
  MusicEventInput,
  EventArtist,
  EventArtistInput,
  UpdateEventArtistInput,
  track,
  updatedTrack,
  Connection,
  UpdateUserInput
]

export default makeExecutableSchema({
  typeDefs,
  resolvers: merge(
    queryResolvers,
    mutationResolvers,
    subscriptionsResolvers,
    typeResolvers,
    scalarResolvers
  )
})
