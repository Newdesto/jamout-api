import DataLoader from 'dataloader'
import userModel from '../model'

export default class UserIdLoader {
  constructor({ userId }) {
    this.userId = userId
    this.load = ::this.load
    this.loadMany = ::this.loadMany
    this.loader = new DataLoader(ids => this.list(userId, ids))
    this.list = UserIdLoader.list
  }
  static async list(userId, ids) {
    // @NOTE: Here is where we would do policy checks...
    // @TODO Password deletion
    const users = await userModel.getItemsAsync(ids)
    return users
      .map(u => u.attrs)
  }
  prime(key, value) {
    return this.loader.prime(key, value)
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
