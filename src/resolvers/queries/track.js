export default {
  async track(root, { userId }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    if (userId) {
      const tracks = await Track.fetchByUserId(userId)
      return tracks
    }
    const tracks = Track.fetchByUserId(user.id)
    return tracks
  }
}