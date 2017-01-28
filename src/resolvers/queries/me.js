const resolvers = {
  me(root, args, { user, User }) {
    if (!user) {
      throw new Error('Unauthorized.')
    }

    return User.fetchById(user.id)
  }
}

export default resolvers
