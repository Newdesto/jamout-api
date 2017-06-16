import vogels from 'io/vogels'
import Joi from 'joi'

const Playlist = vogels.define('Playlist', {
  hashKey: 'userId',
  rangeKey: 'id',
  tableName: 'music.playlist',
  timestamps: true,
  schema: {
    id: Joi.string(),

    soundCloudId: Joi.number(),
    userId: Joi.string(),

    type: Joi.string().valid(['EP', 'ALBUM']),
    soundCloudType: Joi.string(),
    privacySetting: Joi.string().valid(['ANYONE', 'OWNER_ONLY']),

    title: Joi.string(),
    artist: Joi.string(),

    artworkS3Key: Joi.string(),
    soundCloudArtworkUrl: Joi.string(),
    description: Joi.string(),

    duration: Joi.number(),
    upc: Joi.string(),
    ean: Joi.string(),

    tracks: Joi.array().items(Joi.string())
  }
})

export default Playlist
