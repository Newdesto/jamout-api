import MusicContent from '../models/MusicContent'

const getMusicContentByUserId = async function getMusicContentByUserId(userId) {
  const { Items } = await MusicContent
    .query(userId)
    .execAsync()

  return Items.map(i => i.attrs)
}

export default getMusicContentByUserId
