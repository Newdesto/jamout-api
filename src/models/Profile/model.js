import vogels from '../../utils/vogels'
import Joi from 'joi'

const Profile = vogels.define('Profile', {
  hashKey: 'userId',
  tableName: process.env.TABLE_PROFILE,
  timestamps: true,
  schema: {
    id: vogels.types.uuid(),
    userId: Joi.string(),
    username: Joi.string(), // needs to be up to date with user object
    permalink: Joi.string(),
    displayName: Joi.string(),
    location: Joi.string(),
    avatarKey: Joi.string() // avatars are stored in the jamout-profile bucket
  },
  indexes : [{
    hashKey : 'permalink', name : 'permalink-index', type : 'global'
  }]
})

export default Profile
