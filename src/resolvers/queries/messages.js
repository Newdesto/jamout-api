export default {
  messages(root, { channelId, limit }, { user, Message }) {
    if(!user)
      throw new Error('Authentication failed.')

    return Message.getMessages(channelId, limit)
  }
}
