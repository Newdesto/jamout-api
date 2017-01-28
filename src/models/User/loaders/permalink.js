import DataLoader from 'dataloader'
import userModel from '../model'
import R from 'ramda'

export default class UserPermalinkLoader {
  constructor({ permalink }) {
    this.permalink = permalink
    this.load = ::this.load
    this.loadMany = ::this.loadMany
    this.loader = new DataLoader(permalinks => this.list(permalink, permalinks))
    this.list = UserPermalinkLoader.list
  }
  static async list(permalink, permalinks) {
    // @NOTE: Here is where we would do policy checks...
    const users = await Promise.all(permalinks.map(p => userModel
        .query(p)
        .usingIndex('permalink-index')
        .execAsync()))

    // Flattens and maps x2 because of our Promise.all above.
    return R.flatten(users.map(u => u.Items))
      .map(u => u.attrs)
  }
  prime(key, value) {
    return this.loader.prime(key, value)
  }
  clear(permalink) {
    return this.loader.clear(permalink)
  }
  load(permalink) {
    return this.loader.load(permalink)
  }
  loadMany(permalinks) {
    return this.loader.loadMany(permalinks)
  }
}
