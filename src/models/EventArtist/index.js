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

  async fetchByEventId(user, payload) {
    if (!user.id) { throw new Error('User ID is undefined.') }

    const { Items } = await eventArtistModel
      .scan()
      .where('eventId').equals(payload)
      .execAsync()
    const events = Items.map(e => e.attrs)

    return events
  }

  async fetchByPartnerId(partner) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { Items } = await eventArtistModel
      .scan()
      .where('partnerId').equals(partner.id)
      .execAsync()

    const events = Items.map(e => e.attrs)

    return events
  }

  async fetchByUserId(user) {
    if (!user.id) { throw new Error('User ID is undefined.') }

    const { Items } = await eventArtistModel
      .scan()
      .where('partnerId').equals(user.id)
      .execAsync()

    const events = Items.map(e => e.attrs)

    return events
  }

  async updateEventArtist(partner, eventArtist, response) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { attrs } = await eventArtistModel
      .updateAsync({
        id: eventArtist.id,
        status: response
      })

    return attrs
  }

}
