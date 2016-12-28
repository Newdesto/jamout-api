import { createCustomer } from '../../utils/stripe'
import { hashPassword } from '../../utils/auth'

// @TODO try/catch...
export default {
  async signUp(root, args, { user: authedUser, User }) {
    if(authedUser)
      throw new Error('Unauthorized.')

    const accessToken = User.create(args)
    return accessToken

  }
}
