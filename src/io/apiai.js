/**
 * The API.ai IO module is responsible for sending HTTP requests
 * (both text and event) to the API.ai api.
 * Furthermore, it picks up any network or API.ai specific errors.
 * See https://docs.api.ai/docs/reference for more information.
 */
import request from 'request'

/**
 * See (https://docs.api.ai/docs/query)
 * Sends a text query to API.ai and checks for any errors.
 * @param  {String} text    Text to be parsed by API.ai
 * @param  {Object} options (https://docs.api.ai/docs/query#query-parameters-and-json-fields)
 * @return {Promise}         API.ai's response
 */
export const textRequest = function textRequest(text, options) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://api.api.ai/v1/query?v=20150910',
      method: 'POST',
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
      body = JSON.parse(body)

      // Do some error checking.
      if (error) {
        reject(error)
      } else if (body.status.code !== 200) {
        reject(new Error(body.status.errorDetails))
      } else if (body.status.errorType === 'deprecated') {
        logger.warn('API.ai returned a deprecated error type.')
      }

      resolve(body)
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
    request({
      url: 'https://api.api.ai/v1/query?v=20150910',
      method: 'POST',
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
      body = JSON.parse(body)

      // Do some error checking.
      if (error) {
        reject(error)
      } else if (body.status.code !== 200) {
        reject(new Error(body.status.errorDetails))
      } else if (body.status.errorType === 'deprecated') {
        logger.warn('API.ai returned a deprecated error type.')
      }

      resolve(body)
    })
  })
}
