import vogels from '../../utils/vogels'
import Joi from 'joi'

const StudioEvent = vogels.define('StudioEvent', {
  hashKey: 'userId',
  rangeKey: 'createdAt',
  tableName: 'studio.event',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // id
    type: Joi.string(), // inquiry pending, inquiry denied, inquiry accepted, session planned, artist paid, session completed, review
    username: Joi.string(),
    studio: Joi.string(),
    userId: Joi.string(),
    studioId: Joi.string(),
    startDate: Joi.date().timestamp(),
    endDate: Joi.date().timestamp(),
    }
  })

export default StudioEvent
