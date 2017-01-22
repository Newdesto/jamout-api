import trackModel from './model'

export default class track {

  // fetches all tracks
  async fetchAll() {
    const { Items } = await trackModel
      .scan()
      .loadAll()
      .where('isPublic').equals(true)
      .execAsync()

    return Items.map(t => t.attrs)
  }

  // fetching a user's public tracks i.e. if a partner needs to see
  async fetchByUserId(userId) {
    if (!userId) { throw new Error('User ID is undefined.') }

    const { Items } = await trackModel
      .scan()
      .where('userId').equals(userId)
      .where('isPublic').equals(true)
      .execAsync()

    const tracks = Items.map(t => t.attrs)

    return tracks
  }
  // for fetching if user's own tacks
  async fetchMyTracks(userId) {
    if (!userId) { throw new Error('User ID is undefined.') }

    const { Items } = await trackModel
      .scan()
      .where('userId').equals(userId)
      .execAsync()

    const tracks = Items.map(t => t.attrs)

    return tracks
  }

  // editing tracks
  async editTrack(user, trackId, payload) {
    if (!user) { throw new Error('User ID is undefined.') }

    const updatedResponse = await trackModel.updateAsync({ id: trackId, ...payload })

    return updatedResponse.attrs
  }

  async createTrack(user, title, isPublic) {
    if (!user) { throw new Error('User ID is undefined.') }
    console.log(title)
    console.log(isPublic)

    const { attrs } = await trackModel.createAsync({
      userId: user.id, // assumes JWT is up to date
      user: {
        id: user.id,
        displayName: user.username
      },
      title: title || 'Untitled',
      isPublic: isPublic || false,
      status: 'processing', // processing, failed, finished
      type: 'original',
      playCount: 0
    })

    return attrs
  }

  async deleteTrack(user, trackId) {
    if (!user) { throw new Error('User ID is undefined.') }
    try {
      await trackModel.destroyAsync(trackId, { expected: { userId: user.id } })
      return 'Deleted'
    } catch (e) {
      return 'Failed'
    }
  }

}
