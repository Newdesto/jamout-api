import vogels from 'io/vogels'
import Joi from 'joi'

const User = vogels.define('User', {
  hashKey: 'id',
  tableName: 'user.identity',
  timestamps: true,
  schema: {
    id: Joi.string(),

    // Account
    email: Joi.string().email(),
    password: Joi.string(),
    phoneNumber: Joi.string(),
    stripeCustomerId: Joi.string(),
    soundCloudUserId: Joi.number(),
    soundCloudAccessToken: Joi.string(),

    // Profile
    avatarKey: Joi.string(),
    displayName: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    blurb: Joi.string(),
  },
  indexes: [
    { hashKey: 'email', name: 'email-index', type: 'global' },
    { hashKey: 'soundCloudUserId', name: 'soundCloudUserId-index', type: 'global' }
  ]
})

export default User
