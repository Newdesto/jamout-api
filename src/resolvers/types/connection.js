const resolvers = {
  status({ status }) {
    return {
      c: 'CONFIRMED',
      a: 'ACTION',
      p: 'PENDING'
    }[status]
  },
  async user({ userId }, args, { User }) {
    const user = await User.fetchById(userId)
    return user
  },
  async friend({ friendId }, args, { User }) {
    const user = await User.fetchById(friendId)
    return user
  }
}

export default resolvers
