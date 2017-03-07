export default {
  async release(root, { id }, { user, Release }) {
    if (!user) { throw new Error('Authentication failed.') }

    const release = await Release.fetchById(id, user.id)
    return release
  }
}
