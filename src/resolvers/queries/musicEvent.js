export default {
  musicEvents(root, args, { user, MusicEvent }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    if (user.roles.includes('partner:events')) {
      return MusicEvent.fetchByPartnerId(user.id)
    }

    return MusicEvent.fetchAll()
  }
}
