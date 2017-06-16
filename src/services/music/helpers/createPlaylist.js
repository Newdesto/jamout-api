import cleanDeep from 'clean-deep'
import Playlist from '../models/Playlist'

const createPlaylist = async function createPlaylist(props) {
  const cleanProps = cleanDeep(props)
  const { attrs: playlist } = await Playlist.createAsync(cleanProps)

  return playlist
}

export default createPlaylist
