import userModel from './model'
import profileModel from '../Profile/model'
export UserLoader from './loader'
import jwt from 'jsonwebtoken'
import { createCustomer } from '../../utils/stripe'
import { hashPassword } from '../../utils/auth'
const secret = process.env.JWT_SECRET

export default class User {
  constructor({ loader }) {
    this.loader = loader
    this.fetchByIds = ::this.fetchByIds
    this.fetchById = :: this.fetchById
  }
  async usernameExists(username) {
    const existingUsernames = await userModel
      .query(username)
      .usingIndex('username-index')
      .execAsync()

    if(existingUsernames.Count !== 0)
      return true
    return false
  }
  async emailExists(email) {
    const existingEmails = await userModel
      .query(email)
      .usingIndex('email-index')
      .execAsync()

    if(existingEmails.Count !== 0)
      return true
    return false
  }
  async create({email, username, password}) {
    if(await this.emailExists(email))
      throw new Error('Email already exists.')
    if(await this.usernameExists(username))
      throw new Error('Username already exists.')

    const hashedPassword = await hashPassword(password)
    const { attrs: user } = await userModel.createAsync({
      email,
      username,
      password: hashedPassword,
    })

    const stripeCustomer = await createCustomer({
      description: user.id, // @TODO figure out if this is good lol
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
    const { attrs: profile } = await profileModel.createAsync({
      userId: userStripe.id,
      permalink: userStripe.username,
      displayName: userStripe.username,
      username: userStripe.username,
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
