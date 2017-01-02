import ApiAI from 'apiai'
const apiai = ApiAI('44b5077dd1fb4b9e9672965a99cbc353')

export const request = (text, options) => new Promise((resolve, reject) => {
  const request = apiai.textRequest(text, options)
  request.on('response', response => resolve(response))
  request.on('error', error => reject(error))
  request.end()
})

export default apiai
