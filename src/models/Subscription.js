import vogels from '../utils/vogels'
import Joi from 'joi'

const Subscription = vogels.define('Subscription', {
  hashKey: 'userId',
  rangeKey: 'channelId',
  tableName: process.env.TABLE_SUBSCRIPTION,
  timestamps: true,
  schema: {
    userId: Joi.string(),
    channelId: Joi.string()
  }
})

export default Subscription
