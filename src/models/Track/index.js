import uuid from 'uuid'
import trackModel from './model'
import userModel from '../User/model'

export default class Track {
  constructor() {
    this.fetchById = Track.fetchById
    this.fetchAll = Track.fetchAll
    this.fetchByUserId = Track.fetchByUserId
    this.fetchMyTracks = Track.fetchMyTracks
    this.fetchByPermalink = Track.fetchByPermalink
    this.fetchByUsername = Track.fetchByUsername
    this.createTrack = Track.createTrack
    this.editTrack = Track.editTrack
    this.deleteTrack = Track.deleteTrack
  }
  static async fetchById(id) {
    const Item = await trackModel.getAsync(id)

    if (!Item) {
      return null
    }

    return Item.attrs
  }
  /**
   * Fetches all public tracks.
   */
  static async fetchAll() {
    const { Items } = await trackModel
      .scan()
      .loadAll()
      .where('isPublic').equals(true)
      .execAsync()

    return Items.map(t => t.attrs)
  }

  // fetching a user's public tracks i.e. if a partner needs to see
  static async fetchByUserId(userId) {
    if (!userId) {
      throw new Error('User ID is undefined.')
    }

    const { Items } = await trackModel
      .scan()
      .where('userId')
      .equals(userId)
      .where('isPublic')
      .equals(true)
      .execAsync()

    const tracks = Items.map(t => t.attrs)

    return tracks
  }
  // fetching a user's public tracks i.e. if a partner needs to see
  static async fetchByPermalink(userId, permalink) {
    if (!userId) {
      throw new Error('User ID is undefined.')
    }
    // couldn't get user.fetchByPermalink to work
    const data = await userModel
      .scan()
      .where('permalink')
      .equals(permalink)
      .execAsync()
    const user = data.Items[0].attrs

    const { Items } = await trackModel
      .scan()
      .where('userId')
      .equals(user.id)
      .where('isPublic')
      .equals(true)
      .execAsync()

    const tracks = Items.map(t => t.attrs)

    return tracks
  }
  static async fetchByUsername(username) {
    const data = await userModel
      .scan()
      .where('username')
      .equals(username)
      .execAsync()
    const user = data.Items[0].attrs

    const { Items } = await trackModel
      .scan()
      .where('userId')
      .equals(user.id)
      .where('isPublic')
      .equals(true)
      .execAsync()

    const tracks = Items.map(t => t.attrs)

    return tracks
  }
  // for fetching if user's own tacks
  static async fetchMyTracks(userId) {
    if (!userId) { throw new Error('User ID is undefined.') }

    const { Items } = await trackModel
      .scan()
      .where('userId').equals(userId)
      .execAsync()

    const tracks = Items.map(t => t.attrs)

    return tracks
  }

  // editing tracks
  static async editTrack(user, trackId, payload) {
    if (!user) { throw new Error('User ID is undefined.') }

    const updatedResponse = await trackModel.updateAsync({ id: trackId, ...payload })

    return updatedResponse.attrs
  }

  static async createTrack(user, title, isPublic, audioKeyExtension) {
    if (!user) { throw new Error('User ID is undefined.') }
    const id = uuid()
    const { attrs } = await trackModel.createAsync({
      id,
      userId: user.id, // assumes JWT is up to date
      audioKey: `${user.id}/${id}.${audioKeyExtension}`,
      title: title || 'Untitled',
      isPublic: isPublic || false,
      status: 'processing', // processing, failed, finished
      type: 'original',
      playCount: 0
    })

    return attrs
  }

  static async deleteTrack(user, trackId) {
    if (!user) { throw new Error('User ID is undefined.') }
    try {
      await trackModel.destroyAsync(trackId, { expected: { userId: user.id } })
      return 'Deleted'
    } catch (err) {
      return 'Failed'
    }
  }

}
