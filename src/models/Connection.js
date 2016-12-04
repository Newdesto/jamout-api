import vogels from '../utils/vogels'
import Joi from 'joi'

const Connection = vogels.define('Connection', {
  hashKey: 'userId',
  rangeKey: 'friendId',
  tableName: process.env.TABLE_CONNECTION,
  timestamps: true,
  schema: {
    id: vogels.types.uuid(),
    userId: Joi.string(),
    friendId: Joi.string(),
    status: Joi.string() // confirmed, pending, action
    // action = requires confirm/deny from the userId
  }
})

export default Connection
