const resolvers = {
  createStudioEvent(root, { eventData }, { user, MusicEvent }) {
    console.log('Create a new event.')
    console.log(user.roles.includes('partner:events'))

    if (!user || !user.roles.includes('partner:events')) {
      throw new Error('Authentication failed.')
    }
    console.log(eventData)
    return MusicEvent.createMusicEvent(user, eventData)
  }
}

export default resolvers
