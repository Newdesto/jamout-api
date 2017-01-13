const resolvers = {
  createMusicEvent(root, { eventData }, { user, MusicEvent }) {
    if (!user || !user.roles.includes('partner:events')) {
      throw new Error('Authentication failed.')
    }
    return MusicEvent.createMusicEvent(user, eventData)
  }
}

export default resolvers
