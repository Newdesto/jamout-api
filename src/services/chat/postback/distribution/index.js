import type from './type'
import metadata from './metadata'
import artwork from './artwork'
import tracklist from './tracklist'
import rightsHolder from './rightsHolder'
import confirmAndPay from './confirmAndPay'

const postbackHandlers = {
  ReleaseType: type,
  ReleaseMetadata: metadata,
  ReleaseArtwork: artwork,
  ReleaseTracklist: tracklist,
  ReleaseRightsHolder: rightsHolder,
  ReleaseConfirmAndPay: confirmAndPay
}

export default postbackHandlers
