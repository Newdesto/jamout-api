// We're defining all release resolvers in one file as
// they are all closely related

import { createCustomer } from '../../utils/stripe'

export default {
  createRelease(root, { input }, { user, Release }) {
    if(!user)
      throw new Error('Authentication failed.')
    // @TODO requirement check: 5 songs or premium
    // Possibly remove payment check to payForRelease
    // so free users can "preview"

    // type ENUM
    const type = {
      SINGLE: 's',
      EP: 'e',
      ALBUM: 'a'
    }[input.type]

    // set status
    const status = 'd'
    console.log(input)
    console.log(user)
    console.log(type)
    console.log(status)
    return Release.create(Object.assign(input, { userId: user.id, type, status }))
  },
  updateRelease(root, { id, input }, { user, Release }) {
    if(!user)
      throw new Error('Authentication failed.')

    return Release.update(id, input, user.id)
  },
  deleteRelease(root, { id }, { user, Release }) {
    if(!user)
      throw new Error('Authentication failed.')

    return Release.delete(user.id, id)
  },
  async payForRelease(root, { id, stripeToken, saveSource }, { user, Release, User }) {
    if(!user)
      throw new Error('Authentication failed.')

    // verify the user is a customer on stripe
    // @TODO move to utils
    if(!user.stripe || !user.stripe.customerId) {
      // saveSource = save card to customer object
      const stripeCustomer = await createCustomer({
        description: user.id, // @TODO figure out if this is good lol
        source: stripeToken,
      })

      // update the user, bro
      user = await User.update(user.id, { stripe: { customerId: stripeCustomer.id } })
      user.stripe.customer = stripeCustomer
      // @NOTE we might have to invalidate cache for current user
      // @TODO force the JWT update
    }


    // stripe token is passed if source isn't attached to customer
    // @NOTE: note how we pass an email, Stripe requires it for orders
    // In the future it should be the user's primary email
    return Release.pay({
      id,
      email: user.email,
      customerId: user.stripe.customerId,
      stripeToken: user.stripe.customer.sources.data[0].id,
      metadata: {
        releaseId: id
      }
    })
  }
}
