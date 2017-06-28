import MusicContent from '../models/MusicContent'

const getMusicContentById = async function getMusicContentById({ userId, id }) {
  const { attrs: musicContent } = await MusicContent.getAsync({ userId, id })

  return musicContent
}

export default getMusicContentById
