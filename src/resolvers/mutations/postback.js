import redis from 'redis'

// @TODO move redis client to context
const resolvers = {
  postback(root, { input }, { user }) {
    const client = redis.createClient()
    client.on('error', e => {
      throw new Error('Redis error.')
    })
    client.publish(`postback.${user.id}`, JSON.stringify(input))
    return true
  }
}

export default resolvers
