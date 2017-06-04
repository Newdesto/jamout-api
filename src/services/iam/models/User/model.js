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
    // roles: Joi.array()
    // .items(Joi.string().valid('partner', 'manager')).meta({ dynamoType: 'SS' }),
    stripe: {
      customerId: Joi.string(),
      accountId: Joi.string()
    },
    didBotWelcome: Joi.boolean(),
    didBotExplainTeamJamout: Joi.boolean(),
    didBotExplainJamoutCommunity: Joi.boolean(),
    botContexts: Joi.string(),
    permalink: Joi.string(),
    displayName: Joi.string(),
    location: Joi.string(),
    avatarKey: Joi.string(),
    // Context is context for the website UI, assistant, etc.
    context: Joi.object().keys({
      assistant: Joi.array(), // Literally a copy of API.ai's context.
      web: Joi.object().keys({
        role: Joi.string().valid('partner', 'artist')
      })
    }),
    // User roles. (e.g.; artist, partner:jd2Dw)
    roles: Joi.array().items(Joi.string()),
    // @TODO Permissions?
    acl: Joi.string()
  },
  indexes: [
    { hashKey: 'email', name: 'email-index', type: 'global' },
    { hashKey: 'username', name: 'username-index', type: 'global' },
    { hashKey: 'permalink', name: 'permalink-index', type: 'global' }
  ]
})

export default User
