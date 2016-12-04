import vogels from '../../utils/vogels'
import Joi from 'joi'

const Release = vogels.define('Release', {
  hashKey: 'id',
  tableName: 'distribution',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // index
    status: Joi.string(), // seee enum
    userId: Joi.string(),
    stripeOrderId: Joi.string(),
    type: Joi.string(), // 's', 'e', 'a'
    artworkS3Key: Joi.string(),
    title: Joi.string(),
    artist: Joi.string(),
    recordLabel: Joi.string(),
    language: Joi.string(),
    primaryGenre: Joi.string(),
    secondaryGenre: Joi.string(),
    releaseDate: Joi.number(),
    albumPrice: Joi.number(),
    trackPrice: Joi.number(),
    tracklist: Joi.array().items({
      position: Joi.number(),
      title: Joi.string(),
      isExplicit: Joi.boolean(),
      s3Key: Joi.string()
    })
  }
})

export default Release
