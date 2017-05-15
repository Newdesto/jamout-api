import { getChannels, getChannelById } from '../../models/Channel'
export default {
  async channels(root, args, { user, logger }) {
    try {
      if (!user) {
        throw new Error('Authentication failed.')
      }
      const channels = await getChannels(user.id)

      if (args.channelId) {
        return getChannelById({ channelId: args.channelId })
      }
      return channels
    } catch (err) {
      logger.error(err)
      throw err
    }
  }
}
