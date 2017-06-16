import R from 'ramda'
import { getSubscriptions, getCustomer } from 'utils/stripe'
import userResolvers from './user'

const resolvers = {
  ...R.omit(['connected'], userResolvers),
  async stripeSubscriptions({ stripeCustomerId }) {
    if (stripeCustomerId) {
      const subscriptions = await getSubscriptions(stripeCustomerId)
      return subscriptions
    }

    return null
  },
  async stripeCustomer({ stripeCustomerId }) {
    if (stripeCustomerId) {
      const customer = await getCustomer(stripeCustomerId)
      return customer
    }

    return null
  },
  jwt(root, args, { jwt, user }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return jwt
  }
}

export default resolvers
