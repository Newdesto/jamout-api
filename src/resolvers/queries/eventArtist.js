export default {
  eventArtist(root, { eventId }, { user, EventArtist }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    if (user.roles && user.roles && user.roles.includes('partner:events')) {
      return EventArtist.fetchByPartnerId(user)
    }
    if (eventId) {
      return EventArtist.fetchByEventId(user, eventId)
    }
    return EventArtist.fetchByUserId(user)
  }
}
