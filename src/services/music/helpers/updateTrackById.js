import cleanDeep from 'clean-deep'
import uuid from 'uuid'
import Track from '../models/Track'

const updateTrackById = async function updateTrackById({ userId, id, updates }) {
  if (!userId || !id || !updates) {
    throw new Error('Missing required arguments to update Track object.')
  }

  const cleanUpdates = cleanDeep(updates)

  console.log({
    ...cleanUpdates,
    id,
    userId
  })

  const { attrs: track } = await Track.updateAsync({
    ...cleanUpdates,
    id,
    userId
  })

  return track
}

export default updateTrackById
