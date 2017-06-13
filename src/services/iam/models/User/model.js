import vogels from 'io/vogels'
import Joi from 'joi'

// @TODO move table name to env var
const User = vogels.define('User', {
  hashKey: 'id',
  tableName: 'user.identity',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(),
    displayName: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    blurb: Joi.string(),
    email: Joi.string().email(),
    phoneNumber: Joi.string(),
    password: Joi.string(),
    stripe: {
      customerId: Joi.string(),
      accountId: Joi.string()
    },
    scOauthToken: Joi.string(),
    avatarKey: Joi.string()
  },
  indexes: [
    { hashKey: 'email', name: 'email-index', type: 'global' },
    { hashKey: 'username', name: 'username-index', type: 'global' },
    { hashKey: 'permalink', name: 'permalink-index', type: 'global' }
  ]
})

export default User
