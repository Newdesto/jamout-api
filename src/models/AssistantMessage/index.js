import assistantMessageModel from './model'
import logger from 'io'

export default class AssistantMessage {
  async fetchByUserId(userId, limit) {
    if(!userId)
      throw new Error('Invalid userId.')

    if(!limit)
      throw new Error('Invalid limit.')

    try {
      const response = await assistantMessageModel
        .query(userId)
        .limit(limit)
        .execAsync()

      return response.Items.map(i => i.attrs)
    } catch(e) {
      logger.error(e)
      throw e
    }
  }
}
