import cleanDeep from 'clean-deep'
import merge from 'gql/utils/dynamo-merge'
import uuid from 'uuid'
import Release from '../models/Release'

const updateRelease = async function updateRelease({ userId, contentId, updates }) {
  if (!userId || !contentId || !updates) {
    throw new Error('Missing required arguments to update Release object.')
  }

  // Clean deep removed to account for null values.
  // const cleanUpdates = cleanDeep(updates)

  // First we have to prime the item with empty objects.
  const computedPrimer = merge({
    presets: [
      'rightsHolder = if_not_exists(rightsHolder, {})',
      'defaultMetadata = if_not_exists(defaultMetadata, {})',
      'id = if_not_exists(id, :id)'
    ],
    preparams: {
      ':id': uuid()
    }
  })

  await Release.updateAsync({
    contentId,
    userId
  }, {
    ...computedUpdates,
    ReturnValues: 'ALL_OLD'
  })

  const computedUpdates = merge({
    updates
  })

  console.log(computedUpdates)

  const item = await Release.updateAsync({
    contentId,
    userId
  }, {
    ...computedUpdates,
    ReturnValues: 'ALL_OLD'
  })

  return item
}

export default updateRelease
