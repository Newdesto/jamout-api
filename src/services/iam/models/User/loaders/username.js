import DataLoader from 'dataloader'
import R from 'ramda'
import userModel from '../model'

export default class UserUsernameLoader {
  constructor({ username }) {
    this.username = username
    this.load = ::this.load
    this.loadMany = ::this.loadMany
    this.loader = new DataLoader(usernames => this.list(username, usernames))
    this.list = UserUsernameLoader.list
  }
  static async list(username, usernames) {
    // @NOTE: Here is where we would do policy checks...

    const users = await Promise.all(usernames.map(u => userModel
        .query(u)
        .usingIndex('username-index')
        .execAsync()))

    // Flattens and maps x2 because of our Promise.all above.
    return R.flatten(users.map(u => u.Items))
      .map(u => u.attrs)
  }
  prime(key, value) {
    return this.loader.prime(key, value)
  }
  clear(username) {
    return this.loader.clear(username)
  }
  load(username) {
    return this.loader.load(username)
  }
  loadMany(usernames) {
    return this.loader.loadMany(usernames)
  }
}
