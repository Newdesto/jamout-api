export default {
  async user(root, { id }, { user, User }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    let fetchedUser

    if (id) {
      fetchedUser = await User.fetchById(id)
      return fetchedUser
    }

    fetchedUser = User.fetchById(user.id)
    return fetchedUser
    console.log(user)
    console.log(fetchedUser)
  }
}
