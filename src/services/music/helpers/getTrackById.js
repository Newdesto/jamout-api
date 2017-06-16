import Track from '../models/Track'

const getTrackById = async function getTrackById({ userId, id }) {
  const { attrs: track } = await Track.getAsync({ userId, id })

  return track
}

export default getTrackById
