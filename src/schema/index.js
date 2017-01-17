import { merge } from 'lodash'
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
import Profile from './Profile.gql'
import Release from './Release.gql'
import ReleaseInput from './ReleaseInput.gql'
import ReleaseInputTrack from './ReleaseInputTrack.gql'
import ReleaseStatus from './ReleaseStatus.gql'
import ReleaseTrack from './ReleaseTrack.gql'
import ReleaseType from './ReleaseType.gql'
import StudioEvent from './StudioEvent.gql'
import StudioEventInput from './StudioEventInput.gql'
import Assistant from './Assistant.gql'
import Postback from './Postback.gql'
import MusicEvent from './MusicEvent.gql'
import MusicEventInput from './MusicEventInput.gql'
import EventArtist from './EventArtist.gql'
import EventArtistInput from './EventArtistInput.gql'
import UpdateEventArtistInput from './UpdateEventArtistInput.gql'
import RTE from './RTE.gql'

// @TODO combine schemas by module (e.g.; combine all release defs)
const typeDefs = [
  schema,
  scalar,
  Mutation,
  Query,
  Subscription,
  Assistant,
  Postback,
  Chat,
  Profile,
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
  RTE
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
