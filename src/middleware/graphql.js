import { graphqlExpress } from 'graphql-server-express'
import schema from 'schema'
import Channel from 'models/Channel'
import Message from 'models/Message'
import Release from 'models/Release'
import AssistantMessage from 'models/AssistantMessage'
import User, { UserLoader } from 'models/User'
import Profile, { ProfileLoader } from 'models/Profile'
import { formatError } from 'apollo-errors'
import { logger } from 'io'

export const setupSubscriptionContext = () => {
  // @NOTE since we're handling user context on a field level we'll
  // have to handle the User and Profile connectors on a field level
  //const profileLoader = new ProfileLoader({ userId: user && user.id })
  //const userLoader = new UserLoader({ userId: user && user.id })
  return {
    // User: new User({ loader: userLoader }),
    // Profile: new Profile({ loader: profileLoader }),
    Channel: new Channel(),
    Message: new Message(),
    Release: new Release(),
    AssistantMessage: new AssistantMessage()
  }
}

export default graphqlExpress(req => {
  const user = req.user
  const profileLoader = new ProfileLoader({ userId: user && user.id })
  const userLoader = new UserLoader({ userId: user && user.id })
  return {
    schema,
    context: {
      user,
      User: new User({ loader: userLoader }),
      Profile: new Profile({ loader: profileLoader }),
      Channel: new Channel(),
      Message: new Message(),
      Release: new Release(),
      AssistantMessage: new AssistantMessage()
    },
    formatError,
    logger
  }
})
