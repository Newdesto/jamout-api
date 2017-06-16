import { makeExecutableSchema } from 'graphql-tools'
import queryResolvers from 'resolvers/queries'
import mutationResolvers from 'resolvers/mutations'
import { resolvers as subscriptionsResolvers } from 'resolvers/subscriptions'
import typeResolvers from 'resolvers/types'
import scalarResolvers from 'resolvers/scalar'
import iamSchema from 'services/iam/schema'
import distributionSchema from 'services/distribution/schema'
import musicSchema from 'services/music/schema'
import schema from './schema.gql'
import scalar from './scalar.gql'
import NodeInterface from './NodeInterface.gql'
import EventInterface from './EventInterface.gql'
import Mutation from './Mutation.gql'
import Query from './Query.gql'
import Subscription from './Subscription.gql'

// @TODO combine schemas by module (e.g.; combine all release defs)
const typeDefs = [
  schema,
  scalar,
  NodeInterface,
  EventInterface,
  Mutation,
  Query,
  // Subscription,
  ...iamSchema,
  ...distributionSchema,
  ...musicSchema
]


export default makeExecutableSchema({
  typeDefs,
  resolvers: {
    ...queryResolvers,
    ...mutationResolvers,
    // ...subscriptionsResolvers,
    ...typeResolvers,
    ...scalarResolvers
  }
})
