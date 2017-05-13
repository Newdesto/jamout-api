import vogels from 'io/vogels'
import Joi from 'joi'

const Channel = vogels.define('Channel', {
  hashKey: 'id',
  tableName: 'channel',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(),
    type: Joi.string().valid(['d', 'g']).required(),
    name: Joi.string(), // DM: null, Group: *
    lastMessageId: Joi.string(),
    ownerId: Joi.string(), // DM: null, Group: *
    userIds: vogels.types.stringSet().required(), // array of userIds in channel
    userIdsHash: Joi.string().required()
  },
  indexes: [{
    hashKey: 'userIdsHash', name: 'userIdsHashIndex', type: 'global'
  }]
})

export default Channel
