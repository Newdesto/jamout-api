/**
 * Combines all of the type resolvers
 */

import { resolver as channelResolver } from './Channel'
import { resolver as messageResolver } from './Message'
import { resolver as profileResolver } from './Profile'
import { resolver as releaseResolver } from './Release'
import AssistantEvent from './AssistantEvent'
import AssistantMessage from './AssistantMessage'
import AssistantTyping from './AssistantTyping'

export default {
  Channel: channelResolver,
  Message: messageResolver,
  Profile: profileResolver,
  Release: releaseResolver,
  AssistantEvent,
  AssistantMessage,
  AssistantTyping
}
