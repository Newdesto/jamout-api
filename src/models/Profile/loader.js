import DataLoader from 'dataloader'
import profileModel from './model'

export default class ProfileLoader {
  constructor({ userId }) {
    this.userId = userId
    this.load = ::this.load
    this.loadMany = ::this.loadMany
    this.loader = new DataLoader(ids => ProfileLoader.list(userId, ids))
  }
  static async list(userId, ids) {
    // @NOTE: Here is where we would do policy checks...
    const profiles = await profileModel.getItemsAsync(ids)
    return profiles.map(p => p.attrs)
  }
  load(id) {
    return this.loader.load(id)
  }
  loadMany(ids) {
    return this.loader.loadMany(ids)
  }
}
