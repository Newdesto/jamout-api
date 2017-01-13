export default {
  eventArtist(root, args, { user, EventArtist }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    return EventArtist.fetchAll(user)
  }
}
