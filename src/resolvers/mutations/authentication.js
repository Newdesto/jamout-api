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
  async verifyToken(root, { token }, context) {
    // Verify will handle both signature and expiration
    const decoded = await jwt.verify(token, secret)
    return true
  }
}

export default resolvers
