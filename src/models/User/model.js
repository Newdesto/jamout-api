import vogels from 'io/vogels'
import Joi from 'joi'

// @TODO move table name to env var
const User = vogels.define('User', {
  hashKey: 'id',
  tableName: 'user.identity',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(),
    email: Joi.string().email(),
    username: Joi.string(),
    password:Joi.string(),
    roles: Joi.array().items(Joi.string().valid('partner', 'manager')).meta({dynamoType : 'SS'}),
    stripe: {
      customerId: Joi.string(),
      accountId: Joi.string()
    }
  },
  indexes : [
    { hashKey : 'email', name : 'email-index', type : 'global' },
    { hashKey : 'username', name : 'username-index', type : 'global' }
  ]
})

export default User
