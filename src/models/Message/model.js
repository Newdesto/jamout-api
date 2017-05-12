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
    isBotChannel: Joi.boolean(),
    channelId: Joi.string().required(),
    senderId: Joi.string().required(),
    action: Joi.string(),
    type: Joi.string(),
    initialState: Joi.object(),
    actions: Joi.array().items(Joi.object().keys({
        type: Joi.string().required(),
        payload: Joi.any(),
        error: Joi.boolean()
    }))
  }
})

export default Message