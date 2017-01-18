import vogels from 'io/vogels'
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
  rangeKey: 'senderId',
  tableName: 'chat.message',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // ID of the message
    channelId: Joi.string(), // ID of the channel it was sent in.
    senderId: Joi.string(), // ID of the sender
    // @TODO Figure out if actions need to be persisted. If so this action
    // attribute would only be validated in an input type resolver as a real
    // time event.
    action: Joi.string(), // typing.start, typing.stop, mark.read
    text: Joi.string(), // Message text
    attachment: Joi.object().keys({
      type: Joi.string().valid(['image', 'card']),
      subtype: Joi.string(),
      // image type metadata
      key: Joi.string(),
      bucket: Joi.string(),
      // card type metadata
      elements: Joi.array().items(Joi.object().keys({
        title: Joi.string(),
        imageKey: Joi.string(),
        subtitle: Joi.string(),
        // action when the whole card is clicked
        defaultAction: Joi.object().keys({
          type: Joi.string().valid(['routerRedirect', 'redirect', 'message']),
          url: Joi.string(),
          text: Joi.string()
        }),
        buttons: Joi.array().items(Joi.object().keys({
          // If action + metadata isn't defined the action defaults to the
          // default action above.
          type: Joi.string().valid(['routerRedirect', 'redirect', 'message']),
          url: Joi.string(),
          text: Joi.string(),
          title: Joi.string()
        }))
      }))
    })
  },
  indexes: [{
    hashKey: 'channelId', rangeKey: 'createdAt', name: 'channelId-createdAt-index', type: 'global'
  }]
})

export default Message
