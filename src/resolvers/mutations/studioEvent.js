export default {
  createStudioEvent(root, { currentEventId, nextEvent }, { user, StudioEvent }) {
    if(!user)
      throw new Error('Authentication failed.')

      return StudioEvent.createStudioEvent(user, currentEventId, nextEvent)

  }
}
