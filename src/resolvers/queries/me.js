const resolvers = {
  me(root, args, { user, User }) {
    // Unauthorized users return as null. This let's the client
    // act accordingly (e.g.; if !me then redirect).
    // @TODO Create a User interface and have User + Me type implement. User is
    // for public props like displayName and Me is for private props like email.
    // Account might make more sense for this, instead of Me.
    // @TODO Return a stripped down object for guest users. Using JWT's for
    // guests we can cache analytical cookies and cookies of our own.
    if (!user) {
      return null
    }

    return User.fetchById(user.id)
  }
}

export default resolvers
