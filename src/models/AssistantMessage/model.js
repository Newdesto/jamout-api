import vogels from 'io/vogels'
import Joi from 'joi'

// @NOTE userId also applies for anonymousIds
// we combine them so we can index properly
const AssistantMessage = vogels.define('AssistantMessage', {
  hashKey: 'userId',
  rangeKey: 'createdAt',
  tableName: 'assistant.message',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // index
    type: Joi.string(), // message.text, message.card
    userId: Joi.string(),
    isAnon: Joi.boolean(), // is the userId an anonId
    sender: Joi.string().valid(['a', 'u']), // a = assistant, u = user
    text: Joi.string().empty(''),
    title: Joi.string(),
    subtitle: Joi.string(),
    buttons: Joi.array().items(Joi.object().keys({
      text: Joi.string(),
      postback: Joi.string()
    })),
    // context only applies to assistant sent messages
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
