const resolvers = {
  login(root, args, { user: authedUser, User }) {
    if (authedUser) {
      throw new Error('Unauthorized.')
    }

    return User.login(args)
  }
}

export default resolvers
