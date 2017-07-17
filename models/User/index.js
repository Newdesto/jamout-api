import dynogels from 'gql/io/dynogels'
import Joi from 'joi'
import createUser from './createUser'
import getUserByEmail from './getUserByEmail'
import getUserById from './getUserById'
import getUserBySoundcloudId from './getUserBySoundcloudId'
import updateUser from './updateUser'


const User = devMode => {
  // Define the model
  const model = dynogels.define('User', {
    hashKey: 'id',
    tableName: process.env.USER_TABLE,
    timestamps: true,
    schema: {
      id: Joi.string(),

      // Account
      email: Joi.string().email(),
      password: Joi.string(),
      phoneNumber: Joi.string(),
      stripeCustomerId: Joi.string(),
      soundcloudUserId: Joi.number(),
      soundcloudAccessToken: Joi.string(),
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
      })
    },
    indexes: [
      { hashKey: 'soundcloudUserId', name: 'soundcloudUserId-index', type: 'global' },
      { hashKey: 'email', name: 'email-index', type: 'global' }
    ]
  })

  // Define the helpers.
  model.createUser = createUser
  model.getUserByEmail = getUserByEmail
  model.getUserById = getUserById
  model.getUserBySoundcloudId = getUserBySoundcloudId
  model.updateUser = updateUser

  return model
}

export default User
