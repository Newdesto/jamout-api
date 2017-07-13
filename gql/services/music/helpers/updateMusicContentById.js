import cleanDeep from 'clean-deep'
import uuid from 'uuid'
import MusicContent from '../models/MusicContent'

const updateMusicContentById = async function updateMusicContentById({ userId, id, updates }) {
  if (!userId || !id || !updates) {
    throw new Error('Missing required arguments to update music content object.')
  }

  const cleanUpdates = cleanDeep(updates)

  const { attrs: musicContent } = await MusicContent.updateAsync({
    ...cleanUpdates,
    id,
    userId
  })

  return musicContent
}

export default updateMusicContentById
