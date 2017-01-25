export default {
  release(root, { id }, { user, Release }) {
    if (!user) { throw new Error('Authentication failed.') }

    return Release.fetchById(id, user.id)
  }
}
