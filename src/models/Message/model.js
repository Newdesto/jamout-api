import vogels from '../../utils/vogels'
import Joi from 'joi'

// The primary key is made up of the timestamp and the userId of the sender
// We model it this way for scaleability
// If the hashKey was the channelId or userId it wouldn't be partitioned,
// and it would become a very hot key, especially when the conversation is active
// or has hella users
// NOTE: we use the userid instead of the channelId as the range key bc
// multiple messages can be sent in a given channel at the same time,
// but a user cannot send mutiple messages once
// which means we'll have to index the channelId
const Message = vogels.define('Message', {
  hashKey: 'createdAt',
  rangeKey: 'userId',
  tableName: 'chat.message',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // index
    channelId: Joi.string(), // id of channel message was sent in
    userId: Joi.string(), // id of user who sent message
    text: Joi.string(), // text of the message
    attachments: Joi.array().items(Joi.object().keys({
      callbackId: Joi.string(), // unique id for the set of actions
      // callbackId might correspond to a specific studio request
      isEphemeral: Joi.boolean(),
      fallback: Joi.string(), // plain-text fallback
      color: Joi.string(), // attachment color
      author: Joi.string(),
      authorLink: Joi.string(),
      title: Joi.string(),
      titleLink: Joi.string(),
      text: Joi.string(),
      imageUrl: Joi.string(),
      thumbnailUrl: Joi.string(),
      footer: Joi.string(),
      fields: Joi.array().items(Joi.object().keys({
        title: Joi.string(),
        value: Joi.string(),
        isShort: Joi.boolean() // can be put side by side with others
      })),
      actions: Joi.array().items(Joi.object().keys({
        name: Joi.string(),
        text: Joi.string(),
        type: Joi.string(), // button, date selector, etc
        style: Joi.string(), // default, primary, danger
        value: Joi.string(),
        confirmation: Joi.object().keys({
          title: Joi.string(),
          text: Joi.string(),
          confirmText: Joi.string(),
          cancelText: Joi.string()
        })
      }))
    }))
  },
  indexes : [{
    hashKey : 'channelId', rangeKey: 'createdAt', name : 'channelId-createdAt-index', type : 'global'
  }]
})

export default Message
