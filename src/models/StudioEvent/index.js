import studioEventModel from './model'

export default class StudioEvent {
  async fetchAll() {
    const { Items } = await studioEventModel
      .scan()
      .loadAll()
      .execAsync()


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
  for (let i = 0; i < events.length; i++) {

    let sortedEvent = events.filter(e => {
      return e.sessionId === events[i].sessionId;
    })

    events = events.filter(e => {
      return e.sessionId !== events[i].sessionId;
    })
    console.log(events)
    sortedEvents.push(sortedEvent)
  }
  return sortedEvents;
}


  async createStudioEvent(user, currentEventId, nextEvent) {

  let attrs = null;
  // session types: inquiry pending, inquiry denied, inquiry accepted, session planned, artist paid, session completed, review
    if (currentEventId === 'new-event') {
        attrs = await studioEventModel.createAsync({
        username: user.username,
        userId: user.id, // id the user who made the request
        studioId: nextEvent.studioId, // id of the studio?
        studio: nextEvent.studio,
        type: 'inquiry pending',
      })
      return attrs.attrs;
    }

    const { Items } = await studioEventModel
      .scan()
      .where('id').equals(currentEventId)
      .execAsync()

    const currentEvent = Items[0].attrs;

    switch(currentEvent.type) {
      case 'inquiry pending':
        attrs = await studioEventModel.createAsync({
          username: user.username,
          userId: user.id, // id the user who made the request
          studioId: currentEvent.studioId, // id of the studio?
          studio: currentEvent.studio,
          type: 'inquiry accepted',
          sessionId: currentEvent.sessionId,
        })
        return attrs.attrs;
      case 'inquiry accepted':
        attrs = await studioEventModel.createAsync({
          username: user.username,
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
          username: user.username,
          userId: user.id, // id the user who made the request
          studioId: currentEvent.studioId, // id of the studio?
          studio: currentEvent.studio,
          startDate: nextEvent.startDate,
          endDate: nextEvent.endDate,
          type: 'artist paid',
          sessionId: currentEvent.sessionId,
        })
        return attrs.attrs;
      default:
        return attrs
    }
    return attrs;
  }

}
