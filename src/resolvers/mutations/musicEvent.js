const resolvers = {
  createMusicEvent(root, { eventData }, { user, MusicEvent }) {
    //@TODO change to partmer:events
    if (!user || !user.roles.includes('partner:studio')) {
      throw new Error('Authentication failed.')
    }
    console.log(eventData)
    return MusicEvent.createMusicEvent(user, eventData)
  }
}

export default resolvers
