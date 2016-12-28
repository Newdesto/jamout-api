import ReleaseInputTrack from './ReleaseInputTrack'
import ReleaseType from './ReleaseType'

// @TODO secure status
// @NOTE tracklist assumes a merge
// duplicated position = overwrite
const ReleaseInput = `
  input ReleaseInput {
    type: ReleaseType,
    artworkS3Key: String,
    title: String,
    artist: String,
    recordLabel: String,
    language: String,
    primaryGenre: String,
    secondaryGenre: String,
    releaseDate: Int,
    albumPrice: Int,
    trackPrice: Int,
    tracklist: [ReleaseInputTrack!]
  }
`

export default () => [
  ReleaseInput,
  ReleaseInputTrack,
  ReleaseType
]
