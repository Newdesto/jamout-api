import DataLoader from 'dataloader'
import userModel from './model'

export default class UserLoader {
  constructor({ userId }) {
    this.userId = userId
    this.load = ::this.load
    this.loadMany = ::this.loadMany
    this.loader = new DataLoader(ids => this.list(userId, ids))
    this.list = UserLoader.list
  }
  static async list(userId, ids) {
    // @NOTE: Here is where we would do policy checks...
    // @TODO Password deletion
    const users = await userModel.getItemsAsync(ids)
    return users
      .map(u => u.attrs)
  }
  clear(id) {
    return this.loader.clear(id)
  }
  load(id) {
    return this.loader.load(id)
  }
  loadMany(ids) {
    return this.loader.loadMany(ids)
  }
}
