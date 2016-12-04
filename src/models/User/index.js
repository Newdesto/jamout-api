import userModel from './model'
export UserLoader from './loader'

export default class User {
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
  async update(id, input) {
    const { attrs } = await userModel
      .updateAsync(Object.assign(input, { id }))

    // we should never return the password object
    delete attrs.password

    // invalidate the loader cache
    this.loader.clear(attrs.id)

    return attrs
  }
}
