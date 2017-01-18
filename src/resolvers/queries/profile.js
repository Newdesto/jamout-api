export default {
  async profile(root, { userId }, { user, Profile }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    if (userId) {
      const profile = await Profile.fetchById(userId)
      return profile
    }
    const profile = Profile.fetchById(user.id)
    return profile
  }
}
