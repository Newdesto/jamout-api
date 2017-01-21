export default {
  editTrack(root, { trackId, updatedTrack }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return Track.editTrack(user, trackId, updatedTrack)
  },

  createTrack(root, { title, isPublic }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return Track.createTrack(user, title, isPublic)
  }
}
