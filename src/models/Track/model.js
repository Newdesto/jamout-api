import vogels from 'io/vogels'
import Joi from 'joi'

const Track = vogels.define('Track', {
  hashKey: 'id',
  tableName: 'music.track',
  timestamps: true,
  schema: {
    id: Joi.string(),
    userId: Joi.string(),
    featuredUserIds: Joi.array().items(Joi.string()),
    title: Joi.string(),
    privacySetting: Joi.number(), // 0 = private, 1 = connections, 2 = public
    genres: vogels.types.stringSet(), // [0] = primary, [1], secondary
    tags: vogels.types.stringSet(),
    status: Joi.string(), // processing, failed, finished
    artworkKey: Joi.string(), // used to provision s3 temp url
    audioKey: Joi.string(), // used to provision s3 temp url
    type: Joi.string(),
    playCount: Joi.number()
  }
})

export default Track
