import vogels from 'io/vogels'
import Joi from 'joi'
import shortid from 'shortid'

const Channel = vogels.define('Channel', {
  hashKey: 'id',
  tableName: 'chat.channel.dev',
  timestamps: true,
  schema: {
    id: Joi.string(), // index
    type: Joi.string().valid(['a', 'd', 'g']), // a: Assistant, d: DM, g: Group
    // @TODO restrict name "assistant" if the type is not "a"
    name: Joi.string(), // DM: null, Assistant: Assistant, Group: *
    lastMessageId: Joi.string(), // ID of the last message sent in the channel.
    ownerId: Joi.string(), // DM: null, Assistant: *, Group: *
    // @NOTE If channel is assistant type then the only element is the user.
    users: vogels.types.stringSet(), // array of userIds in channel
    usersHash: Joi.string()
  },
  indexes: [{
    hashKey: 'usersHash', name: 'usersHash-index', type: 'global'
  }]
})

export default Channel
