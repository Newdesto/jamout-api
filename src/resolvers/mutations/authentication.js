import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const resolvers = {
  login(root, args, { user: authedUser, User, logger }) {
    try {
      if (authedUser) {
        throw new Error('Unauthorized.')
      }

      return User.login(args)
    } catch (err) {
      logger.error(err)
      throw err
    }
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
  },
  async updateMe(root, { input }, { user: currentUser, User, logger }) {
    try {
      if (!currentUser) {
        throw new Error('Authentication failed.')
      }
      const user = await User.update(currentUser.id, input)
      return user
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}

export default resolvers
