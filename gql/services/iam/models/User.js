import dynogels from 'gql/io/dynogels'
import Joi from 'joi'

const User = devMode => dynogels.define('User', {
  hashKey: 'id',
  tableName: devMode ? 'User.production' : 'User.development',
  timestamps: true,
  schema: {
    id: Joi.string(),

    // Account
    email: Joi.string().email(),
    password: Joi.string(),
    phoneNumber: Joi.string(),
    stripeCustomerId: Joi.string(),
    soundcloudUserId: Joi.number(),
    soundCloudAccessToken: Joi.string(),
    didOnboard: Joi.boolean(),

    // Profile
    avatarKey: Joi.string(),
    displayName: Joi.string(),
    city: Joi.string(),
    country: Joi.string(),
    blurb: Joi.string(),

    channels: Joi.object().keys({
      paidPlatforms: Joi.object().keys({
        firstName: Joi.string(),
        lastName: Joi.string(),
        address: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zipCode: Joi.string(),
        phoneNumber: Joi.string(),
        didAgree: Joi.boolean()
      })
    }),

    testMode: Joi.boolean().default(process.env.NODE_ENV !== 'production' ? true : undefined)
  },
  indexes: [
    { hashKey: 'soundcloudUserId', name: 'soundcloudUserId-index', type: 'global' },
    { hashKey: 'email', name: 'email-index', type: 'global' }
  ]
})

export default User
