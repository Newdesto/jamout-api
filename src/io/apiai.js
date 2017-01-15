import request from 'request'
//const apiai = ApiAI('44b5077dd1fb4b9e9672965a99cbc353')

export const textRequest = function textRequest(text, options) {
  console.log(JSON.stringify({
    query: text,
    timezone: 'America/Los_Angeles',
    lang: 'en',
    ...options
  }))
  return new Promise((resolve, reject) => {
    return request({
      url: 'https://api.api.ai/v1/query',
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
      if(error) {
        reject(error)
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
