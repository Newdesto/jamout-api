import { handleAPIAIAction } from 'workers/chat/actions'
import Chat from 'services/chat'
import Release from 'models/Release'
import User, { UserIdLoader, UserUsernameLoader, UserPermalinkLoader } from 'models/User'
import { eventRequest } from 'io/apiai'
import { createCustomer, updateCustomer } from 'utils/stripe'

const confirmAndPayHandler = async function confirmAndPayHandler({ user: u, channelId, values }) {
  let user = u
  // Since updateMessage deep merges we can just add a done: true property.
  await Chat.updateMessage({
    channelId,
    timestamp: values.timestamp,
    attachment: {
      done: true
    }
  })

  const idLoader = user && new UserIdLoader({ userId: user.id })
  const usernameLoader = user && new UserUsernameLoader({ username: user.username })
  const permalinkLoader = user && new UserPermalinkLoader({ permalink: user.permalink })
  const userConnector = new User({ idLoader, usernameLoader, permalinkLoader })

  // verify the user is a customer on stripe
  if (!user.stripe || !user.stripe.customerId) {
    // saveSource = save card to customer object
    const stripeCustomer = await createCustomer({
      description: user.id, // @TODO figure out if this is good lol
      source: values.token
    })

    // Update the user, bro
    user = await userConnector.update(user.id, { stripe: { customerId: stripeCustomer.id } })
    user.stripe.customer = stripeCustomer
    // @NOTE We might have to invalidate cache for current user
    // @TODO Force the JWT update
  } else {
    // This should never be thrown, but better safe than sorry
    if (!user.stripe.customerId) { throw new Error('Customer data malformed.') }

    // If they're an existing customer lets add a new source to the customer
    // using the token.
    const stripeCustomer = await updateCustomer(user.stripe.customerId, { source: values.token })
    user.stripe.customer = stripeCustomer
  }

  // stripe token is passed if source isn't attached to customer
  // @NOTE: note how we pass an email, Stripe requires it for orders
  // In the future it should be the user's primary email
  await Release.pay({
    id: values.releaseId,
    email: user.email,
    customerId: user.stripe.customerId,
    source: user.stripe.customer.sources.data[0].id,
    metadata: {
      releaseId: values.releaseId
    }
  })

  // By now we should for sure have a release and can move onto the metadata.
  // Trigger an event on API.ai to post the distribution/metadata intent.
  const metadataResult = await eventRequest({
    name: 'distribution-paid',
    data: {
      releaseId: values.releaseId
    }
  }, {
    sessionId: user.id
  })

  await handleAPIAIAction({ channelId, senderId: user.id }, metadataResult.result)
}

export default confirmAndPayHandler
