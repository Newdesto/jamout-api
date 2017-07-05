import 'app-module-path/register'
import { graphql } from 'graphql'
import schema from './schema'

export default (query, variables, operationName) => (
  graphql(schema, query, null, {}, variables, operationName)
)
