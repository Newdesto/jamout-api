import getMusicContentByUserId from '../helpers/getMusicContentByUserId'

const musicContent = async function musicContent(root, args, { viewer }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }

  const musicContent = await getMusicContentByUserId(viewer.id)
  console.log(musicContent)
  return musicContent
}

export default musicContent
