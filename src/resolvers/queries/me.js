const resolvers = {
  me(root, args, { user, Profile, Channel }) {
    console.log(user)
    if (!user) {
      throw new Error('Unauthorized')
    }

    return Profile.fetchById(user.id)
  }
}

export default resolvers
