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



  async createStudioEvent(user, currentEventId, nextEvent) {

    const { Items } = await studioEventModel
      .scan()
      .where('id').equals(currentEventId)
      .execAsync()

    const currentEvent = Items[0].attrs;

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
      return attrs.attrs;
    }

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
