import vogels from 'io/vogels'
import Joi from 'joi'

const Partner = vogels.define('Partner', {
  hashKey: 'id',
  tableName: 'partner',
  timestamps: true,
  schema: {
    id: Joi.string(),
    stripeAccountId: Joi.string(),
    // Company name, usually
    name: Joi.string(),
    // Array of action and resource permissions this partner has. The members
    // of the company inherit these permissions.
    permissions: Joi.array()
  }
})

export default Partner
