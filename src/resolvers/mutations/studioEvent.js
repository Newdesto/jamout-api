export default {
  createStudioEvent(root, { type, nextEvent }, { user, StudioEvent }) {
    if(!user)
      throw new Error('Authentication failed.')

      return StudioEvent.createStudioEvent(user, type, nextEvent)

  }
}
