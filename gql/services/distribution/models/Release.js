import dynogels from 'gql/io/dynogels'
import Joi from 'joi'
import uuid from 'node-uuid'

const Release = devMode => dynogels.define('Release', {
  hashKey: 'userId',
  rangeKey: 'contentId',
  tableName: devMode ? 'Release.development' : 'Release.production',
  timestamps: true,
  schema: {
    id: Joi.string(),

    // User who started the release.
    userId: Joi.string(),

    // Which content piece did the user init
    // the release from.
    contentId: Joi.string(),

    // Processing. Is there a consumer putting
    // in some work right now?
    processing: Joi.boolean(),

    // Metadata used for traditional channels:
    // Spotify, Apple Music, etc.
    defaultMetadata: Joi.object().keys({
      title: Joi.string(),
      artist: Joi.string(),
      recordLabel: Joi.string(),
      language: Joi.string(),
      primaryGenre: Joi.string(),
      secondaryGenre: Joi.string(),
      releaseDate: Joi.string(), // ISO date string
      price: Joi.number(),

        // Version of audio file to use.
        // Managed by S3.
      artworkVersionId: Joi.string(),
      audioVersionId: Joi.string()
    }),

    // Rights holder of the content.
    rightsHolder: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string(),
      address: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      zipCode: Joi.string(),
      phoneNumber: Joi.string(),
      didAgree: Joi.boolean()
    }),

    tracklist: Joi.array().items(Joi.object().keys({
      position: Joi.number(),
      title: Joi.string(),
      artist: Joi.string(),
      featuredArtists: Joi.array().items(Joi.string()),
      isExplicit: Joi.boolean(),
      price: Joi.number().valid([69, 99, 129]),
      id: Joi.string(),

      // Version of audio file to use.
      // Managed by S3.
      audioVersionId: Joi.string().default('latest')
    })),

    status: Joi.string().valid(['LIVE', 'PROCESSING', 'ISSUE'])
  }
})

export default Release
