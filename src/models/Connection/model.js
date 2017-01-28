import vogels from 'io/vogels'
import Joi from 'joi'

const Connection = vogels.define('Connection', {
  hashKey: 'userId',
  rangeKey: 'friendId',
  tableName: 'connection',
  timestamps: true,
  schema: {
    id: Joi.string(),
    userId: Joi.string(),
    friendId: Joi.string(),
    status: Joi.string() // confirmed, pending, action
    // action = requires confirm/deny from the userId
  }
})

export default Connection
