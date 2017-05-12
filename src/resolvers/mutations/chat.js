/**
 * The chat mutation resolvers.
 */
import microtime from 'microtime'
import { createChannel, hasSubscriptionToChannel } from 'models/Channel'
import { pubsub } from 'io/subscription'
import { createMessage } from 'models/Message'
import botSideEffect from 'services/chat/botSideEffect'
import { propEq, cond } from 'ramda'
import uuid from 'uuid'

const channelTypeEnum = {
  BOT: 'b',
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
  async sendTextMessage(root, { input: { id, channelId: cid, text, isBotChannel } }, { logger, viewer: { id: viewerId } }) {
    try {
      logger.debug('New text message received.')
      const isTeamJamout = cid === 'TEAM_JAMOUT'
      const isCommunity = cid === 'COMMUNITY'
      const isUserCreatedChannel = !isBotChannel && !isTeamJamout && !isCommunity
      const channelId = cond([
        [ ({ isBotChannel }) => isBotChannel, () => viewerId ],
        [ ({ isUserCreatedChannel }) => !isUserCreatedChannel, () => channelTypeEnum[cid] ],
        [ ({ isUserCreatedChannel }) => isUserCreatedChannel, () => cid ]
      ])({ isBotChannel, isUserCreatedChannel })

      if (isUserCreatedChannel) {
        logger.debug('Checking for a subscription.')
        const hasSubscription = await hasSubscriptionToChannel({ channelId, viewerId })
        if (!hasSubscription) {
          throw new Error('Authorization failed.')
        }
      }

      logger.debug('Creating item in DDB.')
      const message = await createMessage({
        isBotChannel,
        channelId,
        id: uuid(),
        senderId: viewerId,
        initialState: { text },
        timestamp: microtime.nowDouble().toString(),
      })

      logger.debug('Publishing to PubSub.')
      pubsub.publish('message', message)

      logger.debug('Triggering side effects.')
      await cond([
        [propEq('isBotChannel', true), botSideEffect],
        [propEq('channelId', 't'), () => console.log('Send POST to Slack Thread.')]
      ])(message)

      return message
    } catch (err) {
      console.error(err)
      return err
    }
  }
}
