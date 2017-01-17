/**
 * Combines all of the type resolvers
 */

import Channel from './Channel'
import { resolver as messageResolver } from './Message'
import MessageAttachment from './MessageAttachment'
import { resolver as profileResolver } from './Profile'
import { resolver as releaseResolver } from './Release'
import AssistantEvent from './AssistantEvent'
import AssistantMessage from './AssistantMessage'
import AssistantTyping from './AssistantTyping'

export default {
  Channel,
  Message: messageResolver,
  MessageAttachment,
  Profile: profileResolver,
  Release: releaseResolver,
  AssistantEvent,
  AssistantMessage,
  AssistantTyping
}
