import vogels from 'io/vogels'
import Joi from 'joi'

const Track = vogels.define('Track', {
  hashKey: 'userId',
  rangeKey: 'id',
  tableName: 'music.track',
  timestamps: true,
  schema: {
    id: Joi.string(),

    soundCloudId: Joi.number(),
    userId: Joi.string(),
    privacySetting: Joi.string().valid(['ANYONE', 'OWNER_ONLY']),

    title: Joi.string(),
    artist: Joi.string(),

    // Versioning handled in S3
    artworkS3Key: Joi.string(),
    soundCloudArtworkUrl: Joi.string(),
    audioS3Key: Joi.string(),
    soundCloudAudioUrl: Joi.string(),
    // Note: no versionId set. Latest version is always default.

    primaryGenre: Joi.string(),
    secondaryGenre: Joi.string(),

    description: Joi.string(),
    status: Joi.string().valid(['LIVE', 'PROCESSING', 'ISSUE']),
    statusMessage: Joi.string(), // Open ended for services to set.

    duration: Joi.number(),
    fileFormat: Joi.string(),
    fileSize: Joi.number(),

    isrc: Joi.string()
  }
})

export default Track
