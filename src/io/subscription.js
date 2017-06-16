import { SubscriptionManager, PubSub } from 'graphql-subscriptions'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import schema from 'schema'
import { setupFunctions } from 'resolvers/subscriptions'
import jwt from 'jsonwebtoken'
import Release from 'models/Release'
import User, { UserIdLoader, UserUsernameLoader, UserPermalinkLoader } from 'models/User'
import Track from 'models/Track'
import { logger } from 'io'

// Create a GQL subscription manager using an EventEmitter as the pubsub
// engine, the setupFunctions from our resolver/subscription
// folder and our entire GQL schema.
export const pubsub = new PubSub()
const subscriptionManager = new SubscriptionManager({
  schema,
  pubsub,
  setupFunctions
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


      // Return the context of the subscription.
      return {
        user,
        logger,
        pubsub,
        Partner,
        Release,
        currentUser: user,
        viewer: user,
        User: userConnector,
        Track: new Track()
      }
    }
  }, {
    server: httpServer
  })
}
