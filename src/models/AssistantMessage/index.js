import assistantMessageModel from './model'
import logger from 'io/logger'

export default class AssistantMessage {
  async create(input) {
    if(!input)
      logger.error('No input to create AssistantMessage.')

    try {
      const response = await assistantMessageModel
        .createAsync(input)

      return response.attrs
    } catch(e) {
      logger.error(e)
      throw e
    }
  }
  async fetchByUserId(userId, limit) {
    if(!userId)
      throw new Error('Invalid userId.')

    if(!limit)
      throw new Error('Invalid limit.')

    try {
      const response = await assistantMessageModel
        .query(userId)
        .limit(limit)
        .descending('createdAt')
        .execAsync()

      return response.Items.map(i => i.attrs)
    } catch(e) {
      logger.error(e)
      throw e
    }
  }
}
