const resolvers = {

  createEventArtist(root, { artistData }, { user, EventArtist }) {
    // @TODO change to partmer:events
    if (!user) {
      throw new Error('Authentication failed.')
    }
    return EventArtist.createEventArtist(user, artistData)
  },

  updateEventArtist(root, { musicEvent, response }, { partner, EventArtist }) {
    if (!partner) {
      throw new Error('Authentication failed.')
    }
    return EventArtist.updateEventArtist(partner, musicEvent, response)
  }
}

export default resolvers
