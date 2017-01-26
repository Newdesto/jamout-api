/**
 * Combines all of the type resolvers
 */

import Channel from './channel'
import Message from './message'
import MessageAttachment from './messageAttachment'
import { resolver as profileResolver } from './profile'
import Release from './release'
import MusicEvent from './musicEvent'
import Connection from './connection'
import Track from './track'

export default {
  Channel,
  Message,
  MessageAttachment,
  Profile: profileResolver,
  Release,
  MusicEvent,
  Connection,
  Track
}
