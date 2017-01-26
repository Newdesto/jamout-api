// @TODO Strictly use the Chat class. Do NOT work with the model directly.
import Channel from 'services/chat/channel'
import eventArtistModel from './model'

export default class EventArtist {
  static async createEventArtist(user, payload) {
    const { attrs } = await eventArtistModel.createAsync({
      userId: user.id,
      username: user.username,
      status: 'pending',
      ...payload
    })
    return attrs
  }
  static async fetchByEventId(user, payload) {
    if (!user.id) { throw new Error('User ID is undefined.') }

    const { Items } = await eventArtistModel
      .scan()
      .where('eventId').equals(payload)
      .execAsync()
    const events = Items.map(e => e.attrs)

    return events
  }
  static async fetchByPartnerId(partner) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { Items } = await eventArtistModel
      .scan()
      .where('partnerId').equals(partner.id)
      .execAsync()

    const events = Items.map(e => e.attrs)

    return events
  }
  static async fetchByUserId(user) {
    if (!user.id) { throw new Error('User ID is undefined.') }

    const { Items } = await eventArtistModel
      .scan()
      .where('userId').equals(user.id)
      .execAsync()

    const events = Items.map(e => e.attrs)

    return events
  }

  static async updateEventArtist(partner, eventArtist, response) {
    if (!partner.id) { throw new Error('User ID is undefined.') }

    const { attrs } = await eventArtistModel
      .updateAsync({
        id: eventArtist.id,
        status: response
      })
    const users = [eventArtist.userId, eventArtist.partnerId]

    if (response === 'accepted') {
      const channel = new Channel()
      await channel.createChannel('d', users)
    }

    return attrs
  }

}
