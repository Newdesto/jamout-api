import vogels from 'io/vogels'
import Joi from 'joi'

const AssistantMessage = vogels.define('AssistantMessage', {
  hashKey: 'userId',
  rangeKey: 'createdAt',
  tableName: 'assistant.message',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // index
    sender: Joi.string().valid(['a', 'u']), // a = assistant, u = user
    text: Joi.string(),
    contexts: Joi.array().items(Joi.object().keys({
      name: Joi.string(),
      lifespan: Joi.number(),
      parameters: Joi.object()
    })),
    messenger: {
      message: {
        text: Joi.string()
      }
    }
  }
})

export default AssistantMessage
