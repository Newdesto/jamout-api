import { graphqlExpress } from 'graphql-server-express'
import schema from 'schema'
import Release from 'models/Release'
import Connection from 'models/Connection'
import Chat from 'services/chat'
import User, { UserIdLoader, UserUsernameLoader, UserPermalinkLoader } from 'models/User'
import Partner from 'models/Partner/model'
import StudioEvent from 'models/StudioEvent'
import MusicEvent from 'models/MusicEvent'
import Track from 'models/Track'
import EventArtist from 'models/EventArtist'
import { formatError } from 'apollo-errors'
import { logger, pubsub } from 'io'
import { createJob } from 'io/queue'
import JWT from 'jsonwebtoken'
import BPromise from 'bluebird'

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

export default graphqlExpress(async (req) => {
  let user // Who am I?
  const idLoader = new UserIdLoader({ userId: user && user.id })
  const usernameLoader = new UserUsernameLoader({ username: user && user.username })
  const permalinkLoader = new UserPermalinkLoader({ permalink: user && user.permalink })

  const userConnector = new User({ idLoader, usernameLoader, permalinkLoader })

  // Fetch the user if the JWT is verified.
  if (req.user) {
    user = await userConnector.fetchById(req.user.id)
  }

  // If the web context is partner then we append it so Chat can query the
  // using the correct IDs.
  let chatConnector
  if (user && user.context && user.context.web && user.context.web.role === 'partner') {
    chatConnector = new Chat({
      userId: `${user.id}:partner`
    })
  } else {
    // Default the to implicit artist context.
    chatConnector = new Chat({
      userId: user.id
    })
  }

  return {
    schema,
    context: {
      user,
      createJob,
      logger,
      pubsub,
      Connection,
      Partner,
      currentUser: user,
      jwt: user && req.headers.authorization.slice(7),
      User: userConnector,
      Release: new Release(),
      StudioEvent: new StudioEvent(),
      MusicEvent: new MusicEvent(),
      EventArtist: new EventArtist(),
      Track: new Track(),
      Chat: chatConnector
    },
    formatError,
    logger
  }
})
