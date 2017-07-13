import { graphql } from 'graphql'
import { formatError } from 'apollo-errors'
import jwt from 'jsonwebtoken'
import UserDef from 'gql/services/iam/models/User'
import getUserById from 'gql/services/iam/helpers/getUserById'
import schema from './schema'
import 'request' // Peer dep for request-promise

const createResponse = (statusCode, body) => (
  {

    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Required for CORS
    },
    body: JSON.stringify(body)
  }
)

module.exports.handler = async function handler(event, context, callback) {
  try {
    console.log(process.env)
      const devMode = event.queryStringParameters && !!event.queryStringParameters.devMode

      // Get relevant parameters from stringified body.
      const { query, variables, operationName } = (typeof event.body === 'string') ? JSON.parse(event.body) : event.body

      let token

      // Get the token from the headers
      if (event.headers && event.headers.Authorization) {
        var parts = event.headers.Authorization.split(' ');
        if (parts.length == 2) {
          var scheme = parts[0];
          var credentials = parts[1];

          if (/^Bearer$/i.test(scheme)) {
            token = credentials;
          }
        } else {
          throw new Error('Format is Authorization: Bearer [token]')
        }
      }

      // Verify the token
      let viewer = token && jwt.verify(token, process.env.JWT_SECRET)
      let User

      // Fetch the user object from DB if the JWT is verified.
      if (viewer) {
        User = UserDef(devMode) // Init the User model def.
        viewer = await getUserById(User)(viewer.id, devMode)
      }

      const response = await graphql(schema, query, null, {
        viewer,
        devMode,
        // User is a special use case beause we need it before hand.
        User: () => {
          if (User) {
            return User
          }

          return UserDef(devMode)
        }
      }, variables, operationName)

      callback(null, createResponse(200, response))
  } catch (err) {
    console.error(err)
    callback(null, createResponse(err.responseStatusCode || 500, { message: err.message || 'Internal server error' }))
  }
}
