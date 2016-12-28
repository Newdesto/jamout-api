export default {
  channels(root, args, { user, Channel, Profile }) {
    if(!user)
      throw new Error('Authentication failed.')

    return Channel.getChannelsByUserId(user.id)
  }
}
