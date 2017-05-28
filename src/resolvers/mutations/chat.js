/**
 * The chat mutation resolvers.
 */
import microtime from 'microtime'
import { createChannel, hasSubscriptionToChannel } from 'models/Channel'
import { pubsub } from 'io/subscription'
import { createMessage, updateMessage } from 'models/Message'
import botSideEffect from 'services/chat/botSideEffect'
import { propEq, cond } from 'ramda'
import uuid from 'uuid'
import dynamoMerge from "dynamo-merge"
import triggerSideEffect from 'services/chat/sideEffects'


const channelTypeEnum = {
  TEAM_JAMOUT: 't',
  COMMUNITY: 'c'
}

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
        GROUP: 'g'
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
  async sendMessage(
    root,
    { input: { id, channelId: cid, type, messageState } }, { logger, viewer: { id: viewerId } }
    ) {
    try {
      logger.debug('New text message received.')
      const isBot = cid === viewerId
      const isTeamJamout = cid === 'TEAM_JAMOUT'
      const isCommunity = cid === 'COMMUNITY'
      const isUserCreatedChannel = !isBot && !isTeamJamout && !isCommunity
      const channelId = cond([
        [({ isBot }) => isBot, () => viewerId],
        [({ isUserCreatedChannel }) => !isUserCreatedChannel, () => channelTypeEnum[cid]],
        [({ isUserCreatedChannel }) => isUserCreatedChannel, () => cid]
      ])({ isBot, isUserCreatedChannel })

      if (isUserCreatedChannel) {
        logger.debug('Checking for a subscription.')
        const hasSubscription = await hasSubscriptionToChannel({ channelId, viewerId })
        if (!hasSubscription) {
          throw new Error('Authorization failed.')
        }
      }

      logger.debug('Creating item in DDB.')
      const message = await createMessage({
        id,
        channelId,
        senderId: viewerId,
        messageState,
        timestamp: microtime.nowDouble().toString()
      })

      logger.debug('Publishing to SNS topic.')

      logger.debug('Publishing to PubSub.')
      pubsub.publish('messages', message)

      return message
    } catch (err) {
      console.error(err)
      return err
    }
  },
  async updateMessageState(root, { channelId, timestamp, messageState, action }, { viewer }) {
    if (!viewer) {
      throw new Error('Authentication failed.')
    }1

    // Update the message state in DDB.
    const message = await updateMessage({ channelId, timestamp }, dynamoMerge({ messageState }))

    // Run side effects based on action type.
    const sideEffect = await triggerSideEffect(action)

    return { message, sideEffect }
  }
}
