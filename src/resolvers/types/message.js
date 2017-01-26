const resolvers = {
  async sender({ userId }, arg, { Profile }) {
    return Profile.fetchById(userId)
  }
}

export default resolvers
