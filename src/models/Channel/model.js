import vogels from '../../utils/vogels'
import Joi from 'joi'

const Channel = vogels.define('Channel', {
  hashKey: 'id',
  tableName: process.env.TABLE_CHANNEL,
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // index
    type: Joi.string(), // 'dm', 'group'
    name: Joi.string(), // null if DM, can't index because can be null
    lastMessage: Joi.date(),
    messageCount: Joi.number(),
    ownerUserId: Joi.string(), // null if DM
    users: vogels.types.stringSet(), // array of userId's in the convos
    usersHash: Joi.string()
  },
  indexes : [{
    hashKey : 'usersHash', name : 'usersHash-index', type : 'global'
  }]
})

export default Channel
