export default {
  studioEvent(root, args, { user, StudioEvent }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    if (user.roles.includes('partner:srudio')) {
      return StudioEvent.fetchAll()
    }

    return StudioEvent.fetchByUserId(user.id)
  }
}
