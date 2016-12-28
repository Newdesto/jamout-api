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

  async createEvent(user, newEvent) {
    const { attrs } = await studioEventModel.createAsync({
      username: user.username,
      userId: user.id, // id the user who made the request
      studioId: newEvent.studioId, // id of the studio?
      studio: newEvent.studio,
      type: 'inquiry pending', // inquiry pending, inquiry denied, inquiry accepted, session planned, artist paid, session completed, review
    })

    return attrs;
  }
// mutation: uupdate(timestamp: int, id: ID, input: )
  async updateEvent(id, timestamp, updatedEvent) {
    const { attrs } = await studioEventModel.updateAsync({
      createdAt: updateEvent.createdAt,
      userId: user.id, // id the user who made the request
      studioId: newEvent.studioId, // id of the studio?
      studio: newEvent.studio,
      type: 'inquiry pending', // inquiry pending, inquiry denied, inquiry accepted, session planned, artist paid, session completed, review
    }, {
      expected: { id: updateEvent.id }
    })
  }

}
