import jwt from 'jsonwebtoken'
import AWS from 'aws-sdk'
import shortid from 'shortid'
import userModel from './model'
import {
  UserIdLoader,
  UserUsernameLoader,
  UserPermalinkLoader
} from './loaders'
import { createCustomer } from '../../utils/stripe'
import { hashPassword, authenticate } from '../../utils/auth'

const s3 = new AWS.S3()

const secret = process.env.JWT_SECRET

export default class User {
  constructor({ idLoader, usernameLoader, permalinkLoader }) {
    this.idLoader = idLoader
    this.usernameLoader = usernameLoader
    this.permalinkLoader = permalinkLoader
    this.fetchByIds = ::this.fetchByIds
    this.fetchById = :: this.fetchById
    // Binded for GQL context
    this.login = User.login
    this.create = User.create
    this.update = User.update
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

    const params = { Bucket: 'jamout-profile', Key: `${user.id}/avatar.png` }
    const url = s3.getSignedUrl('getObject', params)

    user.avatarUrl = url
    delete user.artworkKey

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
    const accessToken = jwt.sign(userStripe, secret)

    return accessToken
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
    const { attrs } = await userModel.updateAsync({ id, ...input })

    // we should never return the password object
    delete attrs.password

    // invalidate the loader cache
    this.idLoader.clear(attrs.id)
    return attrs
  }
}
export {
  UserIdLoader,
  UserUsernameLoader,
  UserPermalinkLoader
}
