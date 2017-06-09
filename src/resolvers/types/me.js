import R from 'ramda'
import { getSubscriptions } from 'utils/stripe'
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
  jwt(root, args, { jwt, user }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return jwt
  }
}

export default resolvers
