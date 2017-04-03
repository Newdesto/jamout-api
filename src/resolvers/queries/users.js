export default {
  async users(root, { id, permalink, username }, { user, User }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    const users = await User.fetchAll()
    return users
  }
}
