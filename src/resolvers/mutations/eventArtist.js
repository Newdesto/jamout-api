const resolvers = {

  createEventArtist(root, { artistData }, { user, EventArtist }) {
    // @TODO change to partmer:events
    if (!user) {
      throw new Error('Authentication failed.')
    }
    return EventArtist.createEventArtist(user, artistData)
  },

  updateEventArtist(root, { eventArtist, response }, { user, EventArtist }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    return EventArtist.updateEventArtist(user, eventArtist, response)
  }
}

export default resolvers
