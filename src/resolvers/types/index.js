/**
 * Combines all of the type resolvers
 */

import Channel from './Channel'
import { resolver as messageResolver } from './Message'
import { resolver as profileResolver } from './Profile'
import { resolver as releaseResolver } from './Release'
import AssistantEvent from './AssistantEvent'
import AssistantMessage from './AssistantMessage'
import AssistantTyping from './AssistantTyping'
import StudioEvent from './StudioEvent'
import StudioEventInput from './StudioEventInput'
import MusicEvent from './MusicEvent'

export default {
  Channel,
  Message: messageResolver,
  Profile: profileResolver,
  Release: releaseResolver,
  AssistantEvent,
  AssistantMessage,
  StudioEvent,
  StudioEventInput,
  AssistantTyping,
  MusicEvent
}
