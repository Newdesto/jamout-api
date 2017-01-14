import vogels from 'io/vogels'
import Joi from 'joi'

const Channel = vogels.define('Channel', {
  hashKey: 'id',
  tableName: 'chat.channel',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // index
    type: Joi.string().valid(['a', 'd', 'g']), // a: Assistant, d: DM, g: Group
    name: Joi.string(), // DM: null, Assistant: Assistant, Group: *
    lastMessageId: Joi.string(), // ID of the last message sent in the channel.
    messageCount: Joi.number(),
    ownerUserId: Joi.string(), // DM: null, Assistant: *, Group: *
    // @NOTE If channel is assistant type then assistant is first element in the
    // array and the userId is second element.
    users: vogels.types.stringSet(), // array of userIds in channel
    usersHash: Joi.string()
  },
  indexes: [{
    hashKey: 'usersHash', name: 'usersHash-index', type: 'global'
  }]
})

export default Channel
