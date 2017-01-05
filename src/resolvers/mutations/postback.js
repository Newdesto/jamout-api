import { logger } from 'io'
import {  createJob } from 'io/queue'
import { forIn } from 'lodash'
import redis from 'redis'

/**
 * Caches the postback values in Redis so the successive intents can access the
 * date.
 */
const resolvers = {
  async postback(root, { input: { dialog, next, text, input } }, { user: { id: userId } = {}, AssistantMessage }) {
    if(!userId)
      throw new Error('Unauthorized.')

    const client = redis.createClient()
    client.on('error', e => {
      logger.error(e)
      throw new Error('Redis error.')
    })

    // cache the input
    await new Promise((resolve, reject) => {
      client.hmset(`${userId}.${dialog}`, input, (err, ok) => {
        if(err)
          reject(err)
        resolve(ok)
      })
    })

    // Store message
    const message = await AssistantMessage.create({
      userId:  userId,
      sender: 'u',
      text,
      type: 'message.text'
    })

    // queue the next job and pass the postback along with it
    const job = await createJob(next, {
      userId,
      ...input
    })

    return message
  }
}


export default resolvers
