import vogels from 'io/vogels'
import Joi from 'joi'

const Subscription = vogels.define('Subscription', {
  hashKey: 'userId',
  rangeKey: 'channelId',
  tableName: 'chat.subscription',
  timestamps: true,
  schema: {
    userId: Joi.string(),
    channelId: Joi.string()
  }
})

export default Subscription
