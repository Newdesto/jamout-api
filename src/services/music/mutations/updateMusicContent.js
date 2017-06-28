import updateMusicContentById from '../helpers/updateMusicContentById'

const updateMusicContent = async function updateMusicContent(root, { id, input }, { viewer }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }

  const musicContent = await updateMusicContentById({
      id,
      userId: viewer.id,
      updates: input
  })
  
  return musicContent
}

export default updateMusicContent
