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
