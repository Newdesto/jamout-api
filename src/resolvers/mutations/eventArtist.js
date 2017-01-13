const resolvers = {

  createEventArtist(root, { artistData }, { user, EventArtist }) {
    // @TODO change to partmer:events
    if (!user) {
      throw new Error('Authentication failed.')
    }
    console.log(artistData)
    return EventArtist.createEventArtist(user, artistData)
  }
}

export default resolvers
