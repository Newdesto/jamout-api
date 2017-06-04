import jwt from 'jsonwebtoken'

const secret = process.env.JWT_SECRET

const resolvers = {
  async login(root, args, { user: authedUser, User, logger }) {
    try {
      if (authedUser) {
        throw new Error('Unauthorized.')
      }

      const token = await User.login(args)
      return token
    } catch (err) {
      logger.error(err)
      throw err
    }
  },
  signUp(root, args, { user: authedUser, User, logger }) {
    console.log(args)
    try {
      if (authedUser) {
        throw new Error('Unauthorized.')
      }

      return User.create(args)
    } catch (err) {
      logger.error(err)
      throw err
    }
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
