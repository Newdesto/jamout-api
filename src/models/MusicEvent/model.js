import vogels from 'io/vogels'
import Joi from 'joi'

const MusicEvent = vogels.define('StudioEvent', {
  hashKey: 'id',
  rangeKey: 'createdAt',
  tableName: 'event',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // id
    partner: Joi.string(),
    partnerId: Joi.string(),
    eventName: Joi.string(),
    startDate: Joi.date().timestamp(),
    endDate: Joi.date().timestamp(),
    description: Joi.string(),
    location: Joi.string()
  }
})

export default MusicEvent
