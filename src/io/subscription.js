import { SubscriptionManager, PubSub } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from 'schema'
import { setupFunctions } from 'resolvers/subscriptions'
import { setupSubscriptionContext } from 'middleware/graphql'
import jwt from 'jsonwebtoken'
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
import { logger } from 'io'
import { createJob } from 'io/queue'

// Create a GQL subscription manager using an EventEmitter as the pubsub
// engine, the setupFunctions from our resolver/subscription
// folder and our entire GQL schema.
export const pubsub = new PubSub()
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions
})

/**
 * An onSubscribe listener that initializes the context and parameters for
 * the resolvers.
 */
const onSubscribe = (msg, params) => ({
  ...params,
  context: setupSubscriptionContext(msg.variables && msg.variables.jwt)
})

export const startSubscriptionServer = function startSubscriptionServer(httpServer) {
  return new SubscriptionServer({ 
    subscriptionManager, 
    onConnect: async function onConnect({ authToken }) {
      if (!authToken) {
        throw new Error('Missing authentication token.')
      }

      // For now, only authenticated users will use subscriptions.
      let user = jwt.verify(authToken, process.env.JWT_SECRET)
      const idLoader = new UserIdLoader({ userId: user.id })
      const usernameLoader = new UserUsernameLoader({ username: user.username })
      const permalinkLoader = new UserPermalinkLoader({ permalink: user.permalink })
      const userConnector = new User({ idLoader, usernameLoader, permalinkLoader })

      // Fetch the user object from DB if the JWT is verified.
      if (user) {
        user = await userConnector.fetchById(user.id)
      }

      // If the web context is partner then we append it so Chat can query the
      // using the correct IDs.
      let chatConnector
      if (user.context && user.context.web && user.context.web.role === 'partner') {
        chatConnector = new Chat({
          userId: `${user.id}:partner`
        })
      } else {
        // Default the to implicit artist context.
        chatConnector = new Chat({
          userId: user.id
        })
      }

      // Return the context of the subscription.
      return {
        user,
        createJob,
        logger,
        pubsub,
        Connection,
        Partner,
        Release,
        currentUser: user,
        User: userConnector,
        StudioEvent: new StudioEvent(),
        MusicEvent: new MusicEvent(),
        EventArtist: new EventArtist(),
        Track: new Track(),
        Chat: chatConnector
      }
    }
  }, {
    server: httpServer
  })
}
