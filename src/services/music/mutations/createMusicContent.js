import createMusicContentHelper from '../helpers/createMusicContent'

const createMusicContent = async function createMusicContent(root, { input }, { viewer }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }

  if (!input.id && !input.type) {
    throw new Error('Missing ID or Type field.')
  }

  const musicContent = await createMusicContentHelper({
    ...input,
    userId: viewer.id
  })

  return musicContent
}

export default createMusicContent
