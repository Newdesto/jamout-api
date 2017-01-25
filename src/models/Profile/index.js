import ProfileLoader from './loader'

export default class Profile {
  constructor({ loader }) {
    this.loader = loader
    this.fetchByIds = ::this.fetchByIds
    this.fetchById = :: this.fetchById
  }
  fetchById(id) {
    return this.loader.load(id)
  }
  fetchByIds(ids) {
    return this.loader.loadMany(ids)
  }
}

export {
  ProfileLoader
}
