export default {
  editTrack(root, { trackId, updatedTrack }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return Track.editTrack(user, trackId, updatedTrack)
  },

  createTrack(root, { title, isPublic, audioKeyExtension }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return Track.createTrack(user, title, isPublic, audioKeyExtension)
  },

  deleteTrack(root, { trackId }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return Track.deleteTrack(user, trackId)
  }

}
