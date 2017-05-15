import { getChannels, getChannelById } from '../../models/Channel'
export default {
  async channels(root, args, { user, logger }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }
      if (args.channelId) {
        return getChannelById({ channelId: args.channelId })
      }

      const channels = await getChannels(user.id)
      return channels
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
