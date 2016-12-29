export Channel from './Channel'
export ChannelType from './ChannelType'
export Message from './Message'
export Profile from './Profile'
export Release from './Release'
export ReleaseTrack from './ReleaseTrack'
export ReleaseInput from './ReleaseInput'
export ReleaseInputTrack from './ReleaseInputTrack'
export ReleaseType from './ReleaseType'
export ReleaseStatus from './ReleaseStatus'
import { resolver as channelResolver } from './Channel'
import { resolver as messageResolver } from './Message'
import { resolver as profileResolver } from './Profile'
import { resolver as releaseResolver } from './Release'

export default {
  Channel: channelResolver,
  Message: messageResolver,
  Profile: profileResolver,
  Release: releaseResolver,
}
