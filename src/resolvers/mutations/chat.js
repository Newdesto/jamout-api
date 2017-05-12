/**
 * The chat mutation resolvers.
 */
import shortid from 'shortid'
import microtime from 'microtime'
import { createChannel } from 'models/Channel'

export default {
  async createChannel(root, { input }, { viewer, logger }) {
    const args = input
    try {
      if (!viewer) {
        throw new Error('Authentication failed.')
      }

      // Get the ENUM values.
      const type = {
        DM: 'd',
        GROUP: 'g',
      }[args.type]

      // Do some name  validation.
      if (type === 'd') {
        delete args.name
      }

      const channel = await createChannel({
        type,
        name: args.name,
        userIds: args.userIds,
		    viewerId: viewer.id
      })

	  return channel
    } catch (err) {
      logger.error(err)
      throw err
    }
  },
  async sendTextMessage(root, { channelId, text }, context) {
    // Special case, check this so we don't have to do extra logic
    if (message.channelId === 'general') {
      const { attrs } = await Message.createAsync(message)
      return attrs
    }
    // Check if the user is subscribed to this channel.
    const subscription =
    await Subscription.getAsync({ channelId: message.channelId, userId: this.userId })

    // If the sender was the assistnat don't throw an error.
    // The 'assistant' user doesn't receive a subscription.
    if (!subscription) {
      throw new Error('Authorization failed.')
    }

    // Get the channel so we can check what type it is.
    const channel = await Channel.getAsync(message.channelId)
    if (!channel.attrs) {
      throw new Error('Subscription exists but the channel does not.')
    }

    // Persist the message before we queue it up or publish it. We don't want
    // to process or publish a message that failed to save.
    const { attrs } = await Message.createAsync(message)

    // Check out the channel type.
    if (channel.attrs.type === 'a') {
      // It's an assistant channel, queue up a job to process this message.
      await createJob('chat.processMessage', { message })
    } else {
      // It's a DM or Group channel publish the message for any listeners.
      await Chat.publishMessages(attrs.channelId, attrs.senderId, [attrs])
    }
  }
}
