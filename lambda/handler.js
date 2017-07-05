const handle = require('./graphql/index.lambda').default // eslint-disable-line import/no-unresolved
const createResponse = (statusCode, body) => (
  {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*' // Required for CORS
    },
    body: JSON.stringify(body)
  }
)

module.exports.graphql = (event, context, callback) => {
  // Is thre a way to parse json dirrecrly
  const body = JSON.parse(event.body)
  handle(body.query, body.variables, body.operationName)
    .then(response => callback(null, createResponse(200, response)))
    .catch(error => callback(null, createResponse(error.responseStatusCode || 500, { message: error.message || 'Internal server error' })))
}
