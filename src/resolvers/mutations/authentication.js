import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const resolvers = {
  login(root, args, { user: authedUser, User }) {
    if (authedUser) {
      throw new Error('Unauthorized.')
    }

    return User.login(args)
  },
  signUp(root, args, { user: authedUser, User }) {
    if (authedUser) {
      throw new Error('Unauthorized.')
    }

    return User.create(args)
  },
  async verifyToken(root, { token }) {
    try {
      // Verify will handle both signature and expiration
      await jwt.verify(token, secret)
      return true
    } catch (err) {
      return false
    }
  }
}

export default resolvers
