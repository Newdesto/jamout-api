import { getMessagesByChannelId } from 'models/Message'

export default {
  async messages(root, { channelId }, { viewer: { id: viewerId }, Chat, logger }) {
    try {
      if (!viewerId) {
        throw new Error('Authentication failed.')
      }

      const messages = await getMessagesByChannelId(channelId)
      return messages
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
