import { graphqlExpress } from 'graphql-server-express'
import schema from 'schema'
import { formatError } from 'apollo-errors'
import logger from 'io/logger'
import getUserById from 'services/iam/helpers/getUserById'

export default graphqlExpress(async (req) => {
  let viewer = req.user

  // Fetch the user object from DB if the JWT is verified.
  if (viewer) {
    viewer = await getUserById(viewer.id)
  }

  return {
    schema,
    context: {
      viewer,
      logger
    },
    formatError: (err) => {
      console.trace(err)
      return formatError(err)
    },
    logger
  }
})
