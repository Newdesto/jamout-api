/**
 * Combines all of the type resolvers
 */

import Channel from './Channel'
import { resolver as messageResolver } from './Message'
import MessageAttachment from './MessageAttachment'
import { resolver as profileResolver } from './Profile'
import { resolver as releaseResolver } from './Release'
import StudioEvent from './StudioEvent'
import StudioEventInput from './StudioEventInput'
import MusicEvent from './MusicEvent'
import Connection from './Connection'

export default {
  Channel,
  Message: messageResolver,
  MessageAttachment,
  Profile: profileResolver,
  Release: releaseResolver,
  StudioEvent,
  StudioEventInput,
  MusicEvent,
  Connection
}
