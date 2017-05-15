export default {
  async track(root, { id }, { user, Track }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    const track = await Track.fetchById(id)
    return track
  }
}
