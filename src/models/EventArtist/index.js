import musicEventModel from './model'

export default class EventArtist {

  async createEventArtist(user, payload) {
    const { attrs } = await musicEventModel.createAsync({
      userId: user.id,
      status: 'pending',
      ...payload
    })
    return attrs
  }

  async fetchByEventId(partner, payload) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { Items } = await musicEventModel
      .scan()
      .where('partnerId').equals(payload.eventId)
      .execAsync()

    return this.sortMusicEvents(Items)
  }

  async acceptArtist(partner, payload) {
    // @todo update async
  }

}
