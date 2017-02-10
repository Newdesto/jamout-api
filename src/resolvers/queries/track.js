export default {
  async track(root, { userId, permalink }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    let tracks
    if (userId) {
      tracks = await Track.fetchByUserId(userId)
    }
    if (user.id === userId || user.permalink === permalink) {
      tracks = Track.fetchMyTracks(user.id)
    }
    if (user.permalink !== permalink && !userId) {
      tracks = Track.fetchByPermalink(user.id, permalink)
    }
    if (!userId && !permalink) {
      tracks = Track.fetchAll()
    }
    return tracks
  }
}
