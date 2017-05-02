import DataLoader from 'dataloader'
import { zipObj } from 'ramda'
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
    // @BUG IDs that don't exist don't return null
    // @IMPORTANT Right now this is only used for one
    // user ID at a time. So we have a generic conditional
    // that injects null if the array is empty
    const models = await userModel.getItemsAsync(ids)
    const users = zipObj(models.map(m => m.attrs.id), models.map(m => m.attrs))

    return ids
      .map(id => users[id] || null)
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
