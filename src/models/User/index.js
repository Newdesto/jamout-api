import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import shortid from 'shortid'
import { createError } from 'apollo-errors'
import { fromJS } from 'immutable'
import userModel from './model'
import {
  UserIdLoader,
  UserUsernameLoader,
  UserPermalinkLoader
} from './loaders'
import { createCustomer, deleteCustomer /* , createSubscription */ } from '../../utils/stripe'
import { hashPassword, authenticate } from '../../utils/auth'

const s3 = new AWS.S3()
const secret = process.env.JWT_SECRET
const InvalidLoginError = createError('InvalidLoginError', {
  message: 'Invalid email or password.'
})
const EmailExistsError = createError('EmailExistsError', {
  message: 'Email already exists.'
})
const UsernameExistsError = createError('UsernameExistsError', {
  message: 'Username already exists.'
})


export default class User {
  constructor({ idLoader, usernameLoader, permalinkLoader }) {
    this.idLoader = idLoader
    this.usernameLoader = usernameLoader
    this.permalinkLoader = permalinkLoader
    this.fetchByIds = ::this.fetchByIds
    this.fetchById = :: this.fetchById
    this.fetchByPermalink = :: this.fetchByPermalink
    // Binded for GQL context
    this.login = User.login
    this.create = User.create
    this.update = User.update
    this.fetchAll = User.fetchAll
    this.upgradeToPremium = User.upgradeToPremium
  }
  // Take the stripe id and the time stamp returned from stripe and add it to the user
  // We store createdAt as an integer because that's what stripe wants
  static async upgradeToPremium({ stripeToken, userId }) {
    const stripeCustomer = await createCustomer({
      source: stripeToken,
      metadata: { userId }
    })

    // now we need to subscribe the customer to the premium subscription
    // const subscription = await createSubscription(stripeCustomer.id, plan)
    const { attrs: userStripe } = await userModel.updateAsync({
      id: userId,
      stripeCustomerId: stripeCustomer.id
    })

    return userStripe
  }

  // delete stripe customer entirely
  static async endPremium({ customerId }) {
    const confirmation = await deleteCustomer(customerId)
    return confirmation
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
      throw new InvalidLoginError()
    }

    // Compare the passwords.
    const authenticated = await authenticate(password, user.password)
    if (!authenticated) {
      throw new InvalidLoginError()
    }
    delete user.password

    const params = { Bucket: 'jamout-profile', Key: `${user.id}/avatar.png` }
    const url = s3.getSignedUrl('getObject', params)

    user.avatarUrl = url
    delete user.artworkKey

    // Sign the JWT. aud/iss are either https://api.jamout.co for production
    // or localhost for dev. We do this so JWTs don't get mixed up, and for
    // better security.
    const accessToken = jwt.sign(user, secret, {
      subject: user.id,
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER
    })
    return accessToken
  }
  static async create({ email, username, password }) {
    if (await User.emailExists(email)) {
      throw new EmailExistsError()
    }
    if (await User.usernameExists(username)) {
      throw new UsernameExistsError()
    }

    const hashedPassword = await hashPassword(password)
    const { attrs: user } = await userModel.createAsync({
      email,
      username,
      displayName: username,
      // Generate permalink so we can be sure that it's not taken. Conflicting
      // permalinks are the devil.
      permalink: shortid.generate(),
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
    const accessToken = jwt.sign(userStripe, secret, {
      subject: user.id,
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER
    })

    return accessToken
  }
  static async fetchAll() {
    const { Items } = await userModel
    .scan()
    .loadAll()
    .execAsync()

    return Items.map(i => i.attrs)
  }
  async fetchById(id) {
    const user = await this.idLoader.load(id)
    this.usernameLoader.prime(user.username, user)
    this.permalinkLoader.prime(user.permalink, user)
    return user
  }
  async fetchByIds(ids) {
    const users = await this.idLoader.loadMany(ids)
    users.map(u => this.usernameLoader.prime(u.username, u))
    users.map(u => this.permalinkLoader.prime(u.permalink, u))
    return users
  }
  async fetchByUsername(username) {
    const user = await this.usernameLoader.load(username)
    this.idLoader.prime(user.id, user)
    this.permalinkLoader.prime(user.permalink, user)
    return user
  }
  async fetchByUsernames(usernames) {
    const users = await this.usernameLoader.loadMany(usernames)
    users.map(u => this.idLoader.prime(u.id, u))
    users.map(u => this.permalinkLoader.prime(u.permalink, u))
    return users
  }
  async fetchByPermalink(permalink) {
    const user = await this.permalinkLoader.load(permalink)
    this.idLoader.prime(user.id, user)
    this.usernameLoader.prime(user.username, user)
    return user
  }
  async fetchByPermalinks(permalinks) {
    const users = await this.permalinkLoader.load(permalinks)
    users.map(u => this.idLoader.prime(u.id, u))
    users.map(u => this.usernameLoader.prime(u.username, u))
    return users
  }
  static async update(id, input) {
    // This is an EXTREMELY bad performance issue - we query for the user
    // object, convert the user object and the input to immutable objects,
    // and deepMerge them.
    const oldUserItem = await userModel.getAsync({ id })
    const oldUser = fromJS(oldUserItem.attrs)

    const newUser = fromJS(input)

    const updatedUser = oldUser.mergeDeep(newUser)
    const { attrs } = await userModel.updateAsync(updatedUser.toJS())

    // we should never return the password object
    delete attrs.password

    // invalidate the loader cache
    this.idLoader.clear(attrs.id)
    this.usernameLoader.clear(attrs.username)
    this.permalinkLoader.clear(attrs.permalink)
    return attrs
  }
}
export {
  UserIdLoader,
  UserUsernameLoader,
  UserPermalinkLoader
}
