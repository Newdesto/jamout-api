const resolvers = {

  createEventArtist(root, { artistData }, { user, EventArtist }) {
    // @TODO change to partmer:events
    if (!user) {
      throw new Error('Authentication failed.')
    }
    return EventArtist.createEventArtist(user, artistData)
  },

  updateEventArtist(root, { eventArtist, response }, { partner, EventArtist }) {
    if (!partner) {
      throw new Error('Authentication failed.')
    }
    return EventArtist.updateEventArtist(partner, eventArtist, response)
  }
}

export default resolvers
