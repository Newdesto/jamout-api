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

export default graphqlExpress(async (req) => {
  let user = req.user // Who am I?
  const idLoader = new UserIdLoader({ userId: user && user.id })
  const usernameLoader = new UserUsernameLoader({ username: user && user.username })
  const permalinkLoader = new UserPermalinkLoader({ permalink: user && user.permalink })
  const userConnector = new User({ idLoader, usernameLoader, permalinkLoader })

  // Fetch the user object from DB if the JWT is verified.
  if (user) {
    user = await userConnector.fetchById(user.id)
  }

  // If the web context is partner then we append it so Chat can query the
  // using the correct IDs.
  let chatConnector
  if (user && user.context && user.context.web && user.context.web.role === 'partner') {
    chatConnector = new Chat({
      userId: `${user.id}:partner`
    })
  } else if (user) {
    // Default the to implicit artist context.
    chatConnector = new Chat({
      userId: user.id
    })
  } else {
    chatConnector = new Chat({})
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
      Release,
      currentUser: user,
      jwt: user && req.headers.authorization.slice(7),
      User: userConnector,
      StudioEvent: new StudioEvent(),
      MusicEvent: new MusicEvent(),
      EventArtist: new EventArtist(),
      Track: new Track(),
      Chat: chatConnector
    },
    formatError: (err) => {
      console.trace(err)
      return formatError(err)
    },
    logger
  }
})
