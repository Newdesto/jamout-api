import cleanDeep from 'clean-deep'
import Track from '../models/Track'

const createTrack = async function createTrack(props) {
  const cleanProps = cleanDeep(props)
  const { attrs: track } = await Track.createAsync(cleanProps)

  return track
}

export default createTrack
