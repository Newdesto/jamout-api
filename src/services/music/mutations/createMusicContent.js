import uuid from 'node-uuid'
import createMusicContentHelper from '../helpers/createMusicContent'

const createMusicContent = async function createMusicContent(root, { input }, { viewer }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }

  const musicContent = await createMusicContentHelper({
    ...input,
    id: uuid(),
    userId: viewer.id
  })

  return musicContent
}

export default createMusicContent
