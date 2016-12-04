import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash/merge'
import Query, { resolvers as queryResolvers } from './queries'
import Mutation, { resolvers as mutationResolvers } from './mutations'
import * as types from './types'
import typeResolvers from './types/resolvers'

const Schema = `
  schema {
    query: Query,
    mutation: Mutation
  }
`

export default makeExecutableSchema({
  typeDefs: [Schema, Query, Mutation, ...types],
  resolvers: merge(queryResolvers, mutationResolvers, typeResolvers),
})
