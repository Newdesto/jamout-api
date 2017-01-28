const resolvers = {
  me(root, args, { user, Profile }) {
    if (!user) {
      throw new Error('Unauthorized.')
    }

    return Profile.fetchById(user.id)
  }
}

export default resolvers
