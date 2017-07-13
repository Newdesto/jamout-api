import dynogels from 'gql/io/dynogels'
import Joi from 'joi'

const MusicContent = devMode => dynogels.define('MusicContent', {
  hashKey: 'userId',
  rangeKey: 'id',
  tableName: devMode ? 'MusicContent.development' : 'MusicContent.production',
  timestamps: true,
  schema: {
    id: Joi.string(),

    soundCloudId: Joi.number(),
    userId: Joi.string(),
    privacySetting: Joi.string().valid(['ANYONE', 'OWNER_ONLY']),

    type: Joi.string().valid(['TRACK', 'ALBUM']),

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

    ean: Joi.string(),
    upc: Joi.string(),
    isrc: Joi.string(),

    price: Joi.number(),
    explicitContent: Joi.boolean(),
    language: Joi.string(),

    position: Joi.number(),

    trackIds: Joi.array().items(Joi.string()),
    releaseId: Joi.string()
  }
})

export default MusicContent
