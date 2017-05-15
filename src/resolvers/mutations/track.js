export default {
  updateTrack(root, { id, input }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    const newInput = input
    // Convert the publicity setting enum
    if (input.privacySetting) {
      newInput.privacySetting = {
        PRIVATE: 0,
        CONNECTIONS_ONLY: 1,
        PUBLIC: 2
      }[input.privacySetting]
    }

    return Track.editTrack(user, id, newInput)
  },

  createTrack(root, { title, privacySetting, audioKeyExtension }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return Track.createTrack(user, title, privacySetting, audioKeyExtension)
  },

  deleteTrack(root, { trackId }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    return Track.deleteTrack(user, trackId)
  }

}
