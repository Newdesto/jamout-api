import vogels from 'io/vogels'
import Joi from 'joi'

const Message = vogels.define('Message', {
  hashKey: 'channelId',
  rangeKey: 'timestamp',
  tableName: 'message',
  timestamps: true,
  schema: {
    id: Joi.string().required(),
    timestamp: Joi.string().required(),
    channelId: Joi.string().required(),
    senderId: Joi.string().required(),
    action: Joi.string(),
    type: Joi.string(),
    messageState: Joi.object()
  }
})

export default Message
