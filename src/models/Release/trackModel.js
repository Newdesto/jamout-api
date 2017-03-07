import vogels from 'io/vogels'
import Joi from 'joi'

const Release = vogels.define('Release', {
  hashKey: 'releaseId',
  rangeKey: 'id',
  tableName: 'distribution.track',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(),
    releaseId: Joi.string(),
    // Title should NOT include the feature artists.
    title: Joi.string(),
    primaryArtists: Joi.array().items(Joi.string()),
    featuredArtists: Joi.array().items(Joi.string()),
    position: Joi.number(),
    explicit: Joi.boolean(),
    // No original as we don't transcode audio, yet.
    s3Key: Joi.string(),
    price: Joi.number()
  }
})

export default Release
