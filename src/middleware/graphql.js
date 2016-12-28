import { graphqlExpress } from 'graphql-server-express'
import schema from 'schema'
import Channel from 'models/Channel'
import Message from 'models/Message'
import Release from 'models/Release'
import User, { UserLoader } from 'models/User'
import Profile, { ProfileLoader } from 'models/Profile'
import { formatError } from 'apollo-errors'
import { logger } from 'io'


export default graphqlExpress(req => {
  const user = req.user
  const profileLoader = new ProfileLoader({ userId: user && user.id })
  const userLoader = new UserLoader({ userId: user && user.id })
  return {
    schema,
    context: {
      user,
      Profile: new Profile({ loader: profileLoader }),
      Channel: new Channel(),
      Message: new Message(),
      Release: new Release(),
      User: new User({ loader: userLoader })
    },
    formatError,
    logger
  }
})
