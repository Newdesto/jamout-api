import { graphqlExpress } from 'graphql-server-express'
import schema from 'schema'
import Channel from 'models/Channel'
import Message from 'models/Message'
import Release from 'models/Release'
import Chat from 'services/chat'
import User, { UserLoader } from 'models/User'
import Profile, { ProfileLoader } from 'models/Profile'
import StudioEvent from 'models/StudioEvent'
import MusicEvent from 'models/MusicEvent'
import Track from 'models/Track'
import EventArtist from 'models/EventArtist'
import { formatError } from 'apollo-errors'
import { logger, pubsub } from 'io'
import { createJob } from 'io/queue'

export const setupSubscriptionContext = () =>
  // @NOTE since we're handling user context on a field level we'll
  // have to handle the User and Profile connectors on a field level
  // const profileLoader = new ProfileLoader({ userId: user && user.id })
  // const userLoader = new UserLoader({ userId: user && user.id })

    ({
    // User: new User({ loader: userLoader }),
    // Profile: new Profile({ loader: profileLoader }),
      logger,
      createJob,
      Channel: new Channel(),
      Message: new Message(),
      Release: new Release()
    })

export default graphqlExpress((req) => {
  const user = req.user
  const profileLoader = new ProfileLoader({ userId: user && user.id })
  const userLoader = new UserLoader({ userId: user && user.id })
  return {
    schema,
    context: {
      user,
      createJob,
      logger,
      pubsub,
      User: new User({ loader: userLoader }),
      Profile: new Profile({ loader: profileLoader }),
      Channel: new Channel(),
      Message: new Message(),
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
