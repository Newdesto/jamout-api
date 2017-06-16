import cleanDeep from 'clean-deep'
import uuid from 'uuid'
import Release from '../models/Release'

const updateRelease = async function updateRelease({ userId, contentId, updates }) {
  if (!userId || !contentId || !updates) {
    throw new Error('Missing required arguments to update Release object.')
  }

  const cleanUpdates = cleanDeep(updates)

  const { attrs: release } = await Release.updateAsync({
    ...cleanUpdates,
    contentId,
    userId
  }, {
    UpdateExpression: 'SET id = if_not_exists(id, :id)',
    ExpressionAttributeValues: {
      ':id': ['DR', uuid()].join('-')
    }
  })

  return release
}

export default updateRelease
