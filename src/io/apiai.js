/**
 * The API.ai IO module is responsible for sending HTTP requests
 * (both text and event) to the API.ai api.
 * Furthermore, it picks up any network or API.ai specific errors.
 * See https://docs.api.ai/docs/reference for more information.
 */
import request from 'request'
import logger from 'io/logger'

/**
 * See (https://docs.api.ai/docs/query)
 * Sends a text query to API.ai and checks for any errors.
 * @param  {String} text    Text to be parsed by API.ai
 * @param  {Object} options (https://docs.api.ai/docs/query#query-parameters-and-json-fields)
 * @return {Promise}         API.ai's response
 */
export const textRequest = function textRequest(text, options) {
  return new Promise((resolve, reject) => {
    request.post({
      url: 'https://api.api.ai/v1/query?v=20150910',
      headers: {
        Authorization: 'Bearer 44b5077dd1fb4b9e9672965a99cbc353',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: text,
        timezone: 'America/Los_Angeles',
        lang: 'en',
        ...options
      })
    }, (error, response, body) => {
      const parsedBody = JSON.parse(body)

      // Do some error checking.
      if (error) {
        reject(error)
      } else if (parsedBody.status.code !== 200) {
        reject(new Error(parsedBody.status.errorDetails))
      } else if (parsedBody.status.errorType === 'deprecated') {
        logger.warn('API.ai returned a deprecated error type.')
      }

      resolve(parsedBody)
    })
  })
}

/**
 * See (https://docs.api.ai/docs/query)
 * Sends an event request to API.ai
 * @param  {Object} event   The event object to send
 * @param  {Object} options (https://docs.api.ai/docs/query#query-parameters-and-json-fields)
 * @return {Promise}         API's response
 */
export const eventRequest = function eventRequest(event, options) {
  return new Promise((resolve, reject) => {
    request.post({
      url: 'https://api.api.ai/v1/query?v=20150910',
      headers: {
        Authorization: 'Bearer 44b5077dd1fb4b9e9672965a99cbc353',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event,
        timezone: 'America/Los_Angeles',
        lang: 'en',
        ...options
      })
    }, (error, response, body) => {
      const parsedBody = JSON.parse(body)

      // Do some error checking.
      if (error) {
        reject(error)
      } else if (parsedBody.status.code !== 200) {
        reject(new Error(parsedBody.status.errorDetails))
      } else if (parsedBody.status.errorType === 'deprecated') {
        logger.warn('API.ai returned a deprecated error type.')
      }

      resolve(parsedBody)
    })
  })
}

export const addContexts = function addContexts(contexts, sessionId) {
  return new Promise((resolve, reject) => {
    request.post({
      url: `https://api.api.ai/v1/contexts?v=20150910&sessionId=${sessionId}`,
      headers: {
        Authorization: 'Bearer 44b5077dd1fb4b9e9672965a99cbc353',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contexts)
    }, (error, response, body) => {
      const parsedBody = JSON.parse(body)

      // Do some error checking.
      if (error) {
        reject(error)
      } else if (parsedBody.status.code !== 200) {
        reject(new Error(parsedBody.status.errorDetails))
      } else if (parsedBody.status.errorType === 'deprecated') {
        logger.warn('API.ai returned a deprecated error type.')
      }

      resolve(parsedBody)
    })
  })
}

// We use addContexts to suck the life out of a context because the delete
// context endpoint doesn't support our context names.
// (https://docs.api.ai/docs/contexts#delete-contexts)
export const deleteContextByName = function deleteContextByName(contextName, sessionId) {
  return addContexts([{
    name: contextName,
    lifespan: 0
  }], sessionId)
}
