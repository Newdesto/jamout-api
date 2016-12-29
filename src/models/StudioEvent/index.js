import studioEventModel from './model'

export default class StudioEvent {
  async fetchAll() {
    const { Items } = await studioEventModel
      .scan()
      .loadAll()
      .execAsync()

    return Items.map(i => i.attrs);
  }

  async fetchByUserId(userId) {
    if(!userId)
      throw new Error('User ID is undefined.')
    const { Items } = await studioEventModel
      .scan()
      .where('userId').equals(userId)
      .execAsync()

    return Items.map(i => i.attrs);
  }



  async createEvent(user, currentEventId, nextEvent) {

    const { Items } = await studioEventModel
      .query()
      .where('id').equals(currentEventId)
      .execAsync()

    const currentEvent = Items.attrs;
    console.log(currentEvent)

  let attrs = null;
  // session types: inquiry pending, inquiry denied, inquiry accepted, session planned, artist paid, session completed, review
    if (!currentEvent) {
      attrs = await studioEventModel.createAsync({
        username: user.username,
        userId: user.id, // id the user who made the request
        studioId: nextEvent.studioId, // id of the studio?
        studio: nextEvent.studio,
        type: 'inquiry pending',
      })
      return attrs;
    }

    switch(currentEvent.type) {
      case 'inquiry pending':
        attrs = await studioEventModel.createAsync({
          username: user.username,
          userId: user.id, // id the user who made the request
          studioId: currentEvent.studioId, // id of the studio?
          studio: currentEvent.studio,
          type: 'inquiry accepted',
        })
        return attrs;
      case 'inquiry accepted':
        attrs = await studioEventModel.createAsync({
          username: user.username,
          userId: user.id, // id the user who made the request
          studioId: currentEvent.studioId, // id of the studio?
          studio: currentEvent.studio,
          startDate: nextEvent.startDate,
          endDate: nextEvent.endDate,
          type: 'session planned',
        })
        return attrs;
      case 'session planned':
        attrs = await studioEventModel.createAsync({
          username: user.username,
          userId: user.id, // id the user who made the request
          studioId: currentEvent.studioId, // id of the studio?
          studio: currentEvent.studio,
          startDate: nextEvent.startDate,
          endDate: nextEvent.endDate,
          type: 'artist paid',
        })
        return attrs;
      default:
        return null
    }
    return attrs;
  }

}
