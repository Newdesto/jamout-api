import eventArtistModel from './model'

export default class EventArtist {

  async createEventArtist(user, payload) {
    const { attrs } = await eventArtistModel.createAsync({
      userId: user.id,
      username: user.username,
      status: 'pending',
      ...payload
    })
    return attrs
  }

  async fetchByEventId(partner, payload) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { Items } = await eventArtistModel
      .scan()
      .where('eventId').equals(payload.eventId)
      .execAsync()

    return this.sortMusicEvents(Items)
  }

  async fetchAll(partner) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { Items } = await eventArtistModel
      .scan()
      .where('partnerId').equals(partner.id)
      .execAsync()

    const events = Items.map(e => e.attrs)

    return events
  }

  async updateArtist(partner, musicEvent, response) {
    if (!partner.id) { throw new Error('User ID is undefined.') }
    const artist = await eventArtistModel
      .update({
        eventId: musicEvent.id,
        status: response },
        { expected: { userId: musicEvent.userId } })
      .execAsync(
console.log(artist);
      )
  }

}
