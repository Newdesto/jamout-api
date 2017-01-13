import musicEventModel from './model'

export default class EventArtist {

  async createEventArtist(user, payload) {
    const { attrs } = await musicEventModel.createAsync({
      userId: user.id,
      username: user.username,
      status: 'pending',
      ...payload
    })
    return attrs
  }

  async fetchByEventId(partner, payload) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { Items } = await musicEventModel
      .scan()
      .where('eventId').equals(payload.eventId)
      .execAsync()

    return this.sortMusicEvents(Items)
  }

  async fetchAll(partner) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { Items } = await musicEventModel
      .scan()
      .where('partnerId').equals(partner.id)
      .execAsync()

    const events = {}
    Items.forEach((e) => {
      const event = e.attrs
      if (events[event.eventId]) {
        events[event.eventId].push(event)
      } else {
        events[event.eventId] = [event]
      }
    })

    console.log(events)
    // return this.sortMusicEvents(Items)
  }

  async acceptArtist(partner, payload) {
    // @todo update async
  }

}
