import { graphqlExpress } from 'graphql-server-express'
import schema from 'schema'
import Release from 'models/Release'
import Connection from 'models/Connection'
import Chat from 'services/chat'
import User, { UserIdLoader, UserUsernameLoader, UserPermalinkLoader } from 'models/User'
import StudioEvent from 'models/StudioEvent'
import MusicEvent from 'models/MusicEvent'
import Track from 'models/Track'
import EventArtist from 'models/EventArtist'
import { formatError } from 'apollo-errors'
import { logger, pubsub } from 'io'
import { createJob } from 'io/queue'
import JWT from 'jsonwebtoken'

export const setupSubscriptionContext = (jwt) => {
  const user = jwt && JWT.verify(jwt, process.env.JWT_SECRET)
  const idLoader = user && new UserIdLoader({ userId: user.id })
  const usernameLoader = user && new UserUsernameLoader({ username: user.username })
  const permalinkLoader = user && new UserPermalinkLoader({ permalink: user.permalink })
  // @NOTE since we're handling user context on a field level we'll
  // have to handle the User and Profile connectors on a field level
  // const profileLoader = new ProfileLoader({ userId: user && user.id })
  // const userLoader = new UserLoader({ userId: user && user.id })

  return {
    User: user && new User({ idLoader, usernameLoader, permalinkLoader }),
    logger,
    createJob,
    Release: new Release()
  }
}

export default graphqlExpress((req) => {
  const user = req.user
  const idLoader = new UserIdLoader({ userId: user && user.id })

  const usernameLoader = new UserUsernameLoader({ username: user && user.username })
  const permalinkLoader = new UserPermalinkLoader({ permalink: user && user.permalink })
  return {
    schema,
    context: {
      user,
      createJob,
      logger,
      pubsub,
      Connection,
      jwt: user && req.headers.authorization.slice(7),
      User: new User({ idLoader, usernameLoader, permalinkLoader }),
      Release: new Release(),
      StudioEvent: new StudioEvent(),
      MusicEvent: new MusicEvent(),
      EventArtist: new EventArtist(),
      Track: new Track(),
      Chat: new Chat({ userId: user && user.id })
    },
    formatError,
    logger
  }
})
