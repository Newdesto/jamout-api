import redis from 'redis'

/**
 * Waits for a specific postback message by ID on a user's postback channel
 * @param  {String} userId     [description]
 * @param  {String} postbackId [description]
 * @return {Promise}            [description]
 */
export const postbackById = (userId, postbackId) => new Promise((resolve, reject) => {
  const client = redis.createClient()
  client.on('message', (channel, stringified) => {
    const message = JSON.parse(stringified)
    if(message.id === postbackId)
      resolve(message)
  })
  client.on('error', e => reject(e))
  client.subscribe(`postback.${userId}`)
})
