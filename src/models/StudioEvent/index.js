import studioEventModel from './model'
import userModel from 'models/User/model'

export default class StudioEvent {
  async fetchAll() {
    const { Items } = await studioEventModel
      .scan()
      .loadAll()
      .execAsync()

    console.log(Items)
    return this.sortStudioEvents(Items);
  }

  async fetchByUserId(userId) {
    if(!userId)
      throw new Error('User ID is undefined.')
    const { Items } = await studioEventModel
      .scan()
      .where('userId').equals(userId)
      .execAsync()

    return this.sortStudioEvents(Items);
  }


sortStudioEvents(items) {
  let events = items.map(i => i.attrs);
  let sortedEvents = [];

  while (events.length !== 0) {

    let sortedEvent = events.filter(e => {
      return e.sessionId === events[0].sessionId;
    }).sort((a, b) => {
      const date1 = new Date(a.createdAt)
      const date2 = new Date(a.createdAt)
      return date1  - date2;
    })

    events = events.filter(e => {
      return e.sessionId !== events[0].sessionId;
    })
    sortedEvents.push(sortedEvent)
  }
  return sortedEvents;
}


  async createStudioEvent(userId, type, payload) {

  // probably better way to get this shit
  const { Items } = await userModel
    .scan()
    .where('id').equals(userId)
    .execAsync()
  const user = Items[0].attrs
  let attrs = null;
  const preferredDate = new Date(payload.date + ' ' + payload.time)
  // session types: inquiry pending, inquiry denied, inquiry accepted, session planned, artist paid, session completed, review
    switch(type) {
      case 'new-inquiry':
        attrs = await studioEventModel.createAsync({
          userId: userId, // id the user who made the request
          studioId: this.idStudio(payload.studio), // id of the studio?
          studio: payload.studio,
          type: 'inquiry pending',
          preferredDate: preferredDate,
          username: user.username,
        })
        return attrs.attrs;
/*      case 'inquiry pending':
        attrs = await studioEventModel.createAsync({
          userId: user.id, // id the user who made the request
          studioId: currentEvent.studioId, // id of the studio?
          studio: currentEvent.studio,
          type: 'inquiry accepted',
          sessionId: currentEvent.sessionId,
        })
        return attrs.attrs;
      case 'inquiry accepted':
        attrs = await studioEventModel.createAsync({
          userId: user.id, // id the user who made the request
          studioId: currentEvent.studioId, // id of the studio?
          studio: currentEvent.studio,
          startDate: nextEvent.startDate,
          endDate: nextEvent.endDate,
          type: 'session planned',
          sessionId: currentEvent.sessionId,
        })
        return attrs.attrs;
      case 'session planned':
        attrs = await studioEventModel.createAsync({
          userId: user.id, // id the user who made the request
          studioId: currentEvent.studioId, // id of the studio?
          studio: currentEvent.studio,
          startDate: nextEvent.startDate,
          endDate: nextEvent.endDate,
          type: 'artist paid',
          sessionId: currentEvent.sessionId,
        })
        return attrs.attrs;*/
      default:
        return attrs
    }
    return attrs;
  }

  idStudio(studio) {
    return studio.toLowerCase().replace(' ', '-');
  }

}
