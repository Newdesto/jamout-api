export default {
  releases(root, args, { user, Release }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    if (user.roles.includes('partner:distribution')) {
      return Release.fetchAll()
    }
    return Release.fetchByUserId(user.id)
  }
}
