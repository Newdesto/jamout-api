import request from 'request'

export const textRequest = function textRequest(text, options) {
  return new Promise((resolve, reject) => {
    return request({
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
        logger.warning('API.ai returned a deprecated error type.')
      }

      resolve(body)
    })
  })
}

/*export const eventRequest = (event, options) => new Promise((resolve, reject) => {
  const request = apiai.eventRequest(event, options)
  request.on('response', response => resolve(response))
  request.on('error', error => reject(error))
  request.end()
})*/

//export default apiai
