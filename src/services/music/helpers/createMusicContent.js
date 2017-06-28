import cleanDeep from 'clean-deep'
import MusicContent from '../models/MusicContent'

const createMusicContent = async function createMusicContent(props) {

  const cleanProps = cleanDeep(props)
  const { attrs: musicContent } = await MusicContent.createAsync(cleanProps)

  return musicContent
}

export default createMusicContent
