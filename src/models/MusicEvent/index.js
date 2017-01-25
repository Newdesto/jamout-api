import musicEventModel from './model'

export default class MusicEvent {
  static async createMusicEvent(partner, payload) {
    const { attrs } = await musicEventModel.createAsync({
      partner: partner.username,
      partnerId: partner.id,
      ...payload
    })
    return attrs
  }
  async fetchAll() {
    const { Items } = await musicEventModel
      .scan()
      .loadAll()
      .execAsync()

    return this.sortMusicEvents(Items)
  }
  async fetchByPartnerId(partnerId) {
    if (!partnerId) { throw new Error('User ID is undefined.') }
    const { Items } = await musicEventModel
      .scan()
      .where('partnerId').equals(partnerId)
      .execAsync()

    return this.sortMusicEvents(Items)
  }
  static sortMusicEvents(items) {
    const events = []

    for (let i = 0; i < items.length; i += 1) {
      events.push(items[i].attrs)
    }
    const sortedEvents = events.sort((a, b) => {
      const date1 = new Date(a.createdAt)
      const date2 = new Date(b.createdAt)
      return date2 - date1
    })

    return sortedEvents
  }
}
