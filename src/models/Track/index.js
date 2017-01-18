import trackModel from './model'

export default class track {

  async fetchAll() {
    const { Items } = await trackModel
      .scan()
      .loadAll()
      .execAsync()

    return Items.map(t => t.attrs)
  }

  async fetchByUserId(userId) {
    if (!userId) { throw new Error('User ID is undefined.') }

    const { Items } = await trackModel
      .scan()
      .where('userId').equals(userId)
      .where('isPublic').equals(true)
      .execAsync()

    const tracks = Items.map(t => t.attrs)

    return tracks
  }
}
