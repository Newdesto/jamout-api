import userModel from 'models/User/model'
// @TODO Strictly use the Chat class. Do NOT work with the model directly.
import Channel from 'services/chat/channel'
import studioEventModel from './model'

export default class StudioEvent {
  constructor() {
    this.fetchAll = StudioEvent.fetchAll
    this.fetchByUserId = StudioEvent.fetchByUserId
    this.createStudioEvent = StudioEvent.createStudioEvent
  }
  async fetchAll() {
    const { Items } = await studioEventModel
      .scan()
      .loadAll()
      .execAsync()

    return StudioEvent.sortStudioEvents(Items)
  }
  async fetchByUserId(userId) {
    if (!userId) { throw new Error('User ID is undefined.') }
    const { Items } = await studioEventModel
      .scan()
      .where('userId').equals(userId)
      .execAsync()

    return StudioEvent.sortStudioEvents(Items)
  }
  static sortStudioEvents(items) {
    let events = items.map(i => i.attrs)
    const sortedEvents = []

    while (events.length !== 0) {
      const sortedEvent = events.filter(e => e.sessionId === events[0].sessionId).sort((a, b) => {
        const date1 = new Date(a.createdAt)
        const date2 = new Date(b.createdAt)
        return date1 - date2
      })

      events = events.filter(e => e.sessionId !== events[0].sessionId)
      sortedEvents.push(sortedEvent)
    }
    return sortedEvents
  }


  async createStudioEvent(user, type, payload) {
  // probably better way to get this shit
    const { Items } = await userModel
    .scan()
    .where('id').equals(payload.userId)
    .execAsync()

    const artist = Items[0].attrs

    let attrs = null

    const preferredDate = new Date(`${payload.date} ${payload.time}`)

    const users = [artist.id, payload.studioId]
    if (type === 'inquiry accepted') {
      // create channel
      const channel = new Channel()
      await channel.createChannel('d', users)
    }

  // session types: inquiry pending, inquiry denied, inquiry accepted,
  // session planned, artist paid, session completed, review
    switch (type) {
      case 'new-inquiry':
        attrs = await studioEventModel.createAsync({
          userId: artist.id, // id the user who made the request
          studioId: StudioEvent.idStudio(payload.studio), // id of the studio?
          studio: payload.studio,
          type: 'inquiry pending',
          preferredDate,
          username: artist.username
        })
        return attrs.attrs
      case 'inquiry accepted':
        attrs = await studioEventModel.createAsync({
          userId: artist.id, // id the user who made the request
          username: artist.username,
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          type: 'inquiry accepted',
          sessionId: payload.sessionId
        })
        return attrs.attrs
      case 'inquiry denied':
        attrs = await studioEventModel.createAsync({
          userId: artist.id, // id the user who made the request
          username: artist.username,
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          type: 'inquiry denied',
          sessionId: payload.sessionId
        })
        return attrs.attrs
      case 'session planned':
        attrs = await studioEventModel.createAsync({
          userId: user.id, // id the user who made the request
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          startDate: payload.startDate,
          endDate: payload.endDate,
          type: 'session planned',
          sessionId: payload.sessionId
        })
        return attrs.attrs
      case 'artist paid':
        attrs = await studioEventModel.createAsync({
          userId: user.id, // id the user who made the request
          studioId: payload.studioId, // id of the studio?
          studio: payload.studio,
          startDate: payload.startDate,
          endDate: payload.endDate,
          type: 'artist paid',
          sessionId: payload.sessionId
        })
        return attrs.attrs
      default:
        return attrs
    }
  }
  static idStudio(studio) {
    return studio.toLowerCase().replace(' ', '-')
  }

}
