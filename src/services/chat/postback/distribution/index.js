import type from './type'
import metadata from './metadata'
import artwork from './artwork'

const postbackHandlers = {
  ReleaseType: type,
  ReleaseMetadata: metadata,
  ReleaseArtwork: artwork
}

export default postbackHandlers
