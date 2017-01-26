export default {
  sendMessage(root, { channelId, text }, { user, Message }) {
    if (!user) { throw new Error('Authentication failed.') }

    return Message.createMessage(user.id, channelId, text)
  }
}
