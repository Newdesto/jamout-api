export default {
  studioEvent(root, args, { user, StudioEvent }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    if (user.roles && user.roles.includes('partner:studio')) {
      return StudioEvent.fetchAll()
    }

    return StudioEvent.fetchByUserId(user.id)
  }
}
