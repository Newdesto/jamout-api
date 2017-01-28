import jwt from 'jsonwebtoken'
import userModel from './model'
import profileModel from '../Profile/model'
import UserLoader from './loader'
import { createCustomer } from '../../utils/stripe'
import { hashPassword, authenticate } from '../../utils/auth'

const secret = process.env.JWT_SECRET

export default class User {
  constructor({ loader }) {
    this.loader = loader
    this.fetchByIds = ::this.fetchByIds
    this.fetchById = :: this.fetchById
    // Binded for GQL context
    this.login = User.login
    this.create = User.create
  }
  static async usernameExists(username) {
    const existingUsernames = await userModel
      .query(username)
      .usingIndex('username-index')
      .execAsync()

    if (existingUsernames.Count !== 0) { return true }
    return false
  }
  static async emailExists(email) {
    const existingEmails = await userModel
      .query(email)
      .usingIndex('email-index')
      .execAsync()

    if (existingEmails.Count !== 0) { return existingEmails.Items[0].attrs }
    return false
  }
  static async login({ email, password }) {
    const user = await User.emailExists(email)
    if (!user) {
      throw new Error('Invalid email or password.')
    }

    // Compare the passwords.
    await authenticate(password, user.password)

    delete user.password
    const accessToken = jwt.sign(user, secret)
    return accessToken
  }
  static async create({ email, username, password }) {
    if (await User.emailExists(email)) { throw new Error('Email already exists.') }
    if (await User.usernameExists(username)) { throw new Error('Username already exists.') }

    const hashedPassword = await hashPassword(password)
    const { attrs: user } = await userModel.createAsync({
      email,
      username,
      password: hashedPassword
    })

    // Creates a Stripe customer for the new user.
    // @TODO queue a job.
    const stripeCustomer = await createCustomer({
      description: user.id // @TODO figure out if this is good lol
    })

    const { attrs: userStripe } = await userModel.updateAsync({
      id: user.id,
      stripe: {
        customerId: stripeCustomer.id
      }
    })

    delete userStripe.password
    const accessToken = jwt.sign(userStripe, secret)

    // @TODO move this to a background worker
    await profileModel.createAsync({
      userId: userStripe.id,
      permalink: userStripe.username,
      displayName: userStripe.username,
      username: userStripe.username
    })

    return accessToken
  }
  fetchById(id) {
    return this.loader.load(id)
  }
  fetchByIds(ids) {
    return this.loader.loadMany(ids)
  }
  async update(id, input) {
    const { attrs } = await userModel
      .updateAsync(Object.assign(input, { id }))

    // we should never return the password object
    delete attrs.password

    // invalidate the loader cache
    this.loader.clear(attrs.id)

    return attrs
  }
}
export {
  UserLoader
}
