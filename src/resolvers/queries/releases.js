export default {
  releases(root, args, { user, Release }) {
    if(!user)
      throw new Error('Authentication failed.')

    return Release.fetchByUserId(user.id)
  }
}
