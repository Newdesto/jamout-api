export default {
  updateUser(root, { updatedUser }, { user, User }) {
    if (!user) {
      throw new Error('Authentication failed.')
    }
    
    return User.update(user.id, updatedUser)
  }

}
