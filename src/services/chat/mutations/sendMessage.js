import logger from 'io/logger'
import microtime from 'microtime'
import { cond } from 'ramda'
import { pubsub } from 'io/subscription'
import SNS from 'aws-sdk/clients/sns'
import hasSubscriptionToChannel from '../helpers/hasSubscriptionToChannel'
import createMessage from '../helpers/createMessage'
import channelTypeEnum from '../utils/channelTypeEnum'


const sendMessage =
    async function sendMessage(
      root,
      { input: { id, channelId: cid, type, messageState } },
      { viewer: { id: viewerId } }
    ) {
        // Compute the channel type and channelId.
        // Channel types: bot, team-jamout, jamout-community, user created channel
      const isBot = cid === viewerId
      const isTeamJamout = cid === 'TEAM_JAMOUT'
      const isCommunity = cid === 'COMMUNITY'
      const isUserCreatedChannel = !isBot && !isTeamJamout && !isCommunity
      const channelId = cond([
        [({ isBot }) => isBot, () => viewerId],
        [({ isUserCreatedChannel }) => !isUserCreatedChannel, () => channelTypeEnum[cid]],
        [({ isUserCreatedChannel }) => isUserCreatedChannel, () => cid]
      ])({ isBot, isUserCreatedChannel })

        // Check for a subscription.
      if (isUserCreatedChannel) {
        const hasSubscription = await hasSubscriptionToChannel({ channelId, viewerId })
        if (!hasSubscription) {
          throw new Error('Authorization failed.')
        }
      }

      logger.debug('Creating item in DDB.')
      const message = await createMessage({
        id,
        channelId,
        type,
        messageState,
        senderId: viewerId,
        timestamp: microtime.nowDouble().toString()
      })

      if (!isUserCreatedChannel) {
        logger.debug('Publishing bot/team-jamout/jamout-community message to SNS topic.')
            // @NOTE We have to override the endpoint set by DDB.
        const sns = new SNS({
          endpoint: process.env.SNS_ENDPOINT
        })

            // We have to stringify both the SQS message and the SNS message.
        const snsMessage = {
          TopicArn: process.env.TOPIC_SENT_MESSAGES,
          MessageStructure: 'json',
          Message: JSON.stringify({
            default: message.id,
            sqs: JSON.stringify(message)
          })
        }

            // Publish.
            // @TODO Error handling if it fails to publish.
        await new Promise((resolve, reject) => {
          sns.publish(snsMessage, (err, data) => {
            if (err) {
              reject(err)
            }
            resolve(data)
          })
        })
      }

      logger.debug('Publishing to PubSub.')
      pubsub.publish('messages', message)

      return message
    }

export default sendMessage
