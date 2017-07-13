import { graphql } from 'graphql'
import { formatError } from 'apollo-errors'
import jwt from 'jsonwebtoken'
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
  console.log(process.env)
  try {
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

      // Fetch the user object from DB if the JWT is verified.
      if (viewer) {
        viewer = await getUserById(viewer.id)
      }

      const response = await graphql(schema, query, null, {
        viewer
      }, variables, operationName)

      callback(null, createResponse(200, response))
  } catch (err) {
    console.error(err)
    callback(null, createResponse(err.responseStatusCode || 500, { message: err.message || 'Internal server error' }))
  }
}
