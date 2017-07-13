import { makeExecutableSchema } from 'graphql-tools'
import queryResolvers from 'gql/resolvers/queries'
import mutationResolvers from 'gql/resolvers/mutations'
import typeResolvers from 'gql/resolvers/types'
import scalarResolvers from 'gql/resolvers/scalar'
import iamSchema from 'gql/services/iam/schema'
import distributionSchema from 'gql/services/distribution/schema'
import musicSchema from 'gql/services/music/schema'
import schema from './schema.gql'
import scalar from './scalar.gql'
import NodeInterface from './NodeInterface.gql'
import EventInterface from './EventInterface.gql'
import Mutation from './Mutation.gql'
import Query from './Query.gql'
import LanguageEnum from './LanguageEnum.gql'
import TypeEnum from './TypeEnum.gql'

// @TODO combine schemas by module (e.g.; combine all release defs)
const typeDefs = [
  schema,
  scalar,
  NodeInterface,
  EventInterface,
  Mutation,
  Query,
  LanguageEnum,
  TypeEnum,
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
    ...typeResolvers,
    ...scalarResolvers
  }
})
