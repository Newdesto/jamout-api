import DataLoader from 'dataloader'
import R from 'ramda'
import userModel from '../model'

export default class UserPermalinkLoader {
  constructor({ permalink }) {
    this.permalink = permalink
    this.load = ::this.load
    this.loadMany = ::this.loadMany
    this.loader = new DataLoader(permalinks => this.list(permalinks))
    this.list = UserPermalinkLoader.list
  }
  static async list(permalinks) {
    // @NOTE: Here is where we would do policy checks...
    const userItems = await Promise.all(permalinks.map(p => userModel
        .query(p)
        .usingIndex('permalink-index')
        .execAsync()))

    // Flattens and maps x2 because of our Promise.all above.
    const users = R.flatten(userItems.map(u => u.Items))

    // If some permalinks didn't exist then push a null
    if (users.length !== permalinks.length) {
      return users
        .map(u => u.attrs)
        .concat(R.times(R.identity, (permalinks.length - users.length)).map(() => null))
    }

    return users.map(u => u.attrs)
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
