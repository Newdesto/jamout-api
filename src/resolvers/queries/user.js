export default {
  async user(root, { id, permalink, username }, { user, User }) {
    if (!user) {
      throw new Error('Authentication failed.')
    } else if (!id && !permalink && !username) {
      throw new Error('No arguments provided. Only one is needed.')
    }

    let fetchedUser

    // Figure out what to query by.
    if (id) {
      fetchedUser = await User.fetchById(id)
    } else if (permalink) {
      fetchedUser = await User.fetchByPermalink(permalink)
    } else if (username) {
      fetchedUser = await User.fetchByUsername(username)
    }

    return fetchedUser
  }
}
