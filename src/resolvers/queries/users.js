export default {
  async users(root, { id, permalink, username }, { user, User }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }

    const allUsers = await User.fetchAll()

    // Filter out users with a private acl field.
    const publicUsers = allUsers.filter(u => u.acl !== 'private')
    return publicUsers
  }
}
