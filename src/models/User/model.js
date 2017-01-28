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
    password: Joi.string(),
    roles: Joi.array().items(Joi.string().valid('partner', 'manager')).meta({ dynamoType: 'SS' }),
    stripe: {
      customerId: Joi.string(),
      accountId: Joi.string()
    },
    assistantChannelId: Joi.string(),
    // Existing user vs new user onboarding handled by chat input resolvers and
    // workers.
    didOnboard: Joi.boolean(),
    permalink: Joi.string(),
    displayName: Joi.string(),
    location: Joi.string(),
    avatarKey: Joi.string()
  },
  indexes: [
    { hashKey: 'email', name: 'email-index', type: 'global' },
    { hashKey: 'username', name: 'username-index', type: 'global' },
    { hashKey: 'permalink', name: 'permalink-index', type: 'global' }
  ]
})

export default User
