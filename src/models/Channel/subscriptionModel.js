import vogels from 'io/vogels'
import Joi from 'joi'

const Subscription = vogels.define('Subscription', {
  hashKey: 'userId',
  rangeKey: 'channelId',
  tableName: 'subscription',
  timestamps: true,
  schema: {
    userId: Joi.string().required(),
    channelId: Joi.string().required(),
    // The timestamp of the last message the user read.
    lastRead: Joi.string(),
    // The number of unread messages since the lastRead message.
    unreadCount: Joi.number(),
    // The number of unseen mentions since the lastRead message.
    mentionCount: Joi.number()
  }
})

export default Subscription
