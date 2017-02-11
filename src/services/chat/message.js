import vogels from 'io/vogels'
import Joi from 'joi'

const Message = vogels.define('Message', {
  /*
   * The primary key is a combination of the hash key and the range key. In
   * this case the hash key is the channelId and the range key is a microtime
   * timestamp. We should be fine using the channelId as the hash key since
   * DDB should partition them efficiently. We're going to move to cassandra
   * anyway as we scale, LOL.
   */
  hashKey: 'channelId',
  rangeKey: 'timestamp',
  tableName: 'chat.message.dev',
  timestamps: true,
  schema: {
    // ID of the message.
    id: Joi.string(),
    // The microtime timestamp in microseconds. We don't define a default
    // function because the message timestamps would be totally off
    // since our writes are queued. Instead they should be generated on job
    // creation.
    timestamp: Joi.string(),
    // ID of the channel the message was created it.
    channelId: Joi.string(),
    // The ID of the user who sent the message. If the bot wrote the message
    // it should be 'assistant'
    senderId: Joi.string(),
    // @TODO Figure out if actions need to be persisted. If so this action
    // attribute would only be validated in an input type resolver as a real
    // time event.
    action: Joi.string(), // typing.start, typing.stop, mark.read
    // The content of the message if it's a plain ole text message.
    text: Joi.string(),
    attachment: Joi.object(),
    // who can see the messages bro
    visibleTo: Joi.array()
  },
  indexes: [{
    hashKey: 'channelId', rangeKey: 'createdAt', name: 'channelId-createdAt-index', type: 'global'
  }]
})

export default Message
