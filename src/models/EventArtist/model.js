import vogels from 'io/vogels'
import Joi from 'joi'

const EventArtist = vogels.define('EventArtist', {
  hashKey: 'eventId',
  rangeKey: 'createdAt',
  tableName: 'event.artist',
  timestamps: true,
  schema: {
    id: vogels.types.uuid(), // id
    eventId: Joi.string(),
    username: Joi.string(),
    partnerId: Joi.string(),
    userId: Joi.string(),
    status: Joi.string()
  }
})

export default EventArtist
