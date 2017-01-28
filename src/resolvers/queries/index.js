import merge from 'lodash/merge'
import assistantChannel from './assistantChannel'
import channels from './channels'
import messages from './messages'
import release from './release'
import releases from './releases'
import studioEvent from './studioEvent'
import musicEvent from './musicEvent'
import eventArtist from './eventArtist'
import me from './me'
import user from './user'
import track from './track'

const resolvers = {
  Query: merge(
    me,
    assistantChannel,
    channels,
    messages,
    release,
    releases,
    studioEvent,
    musicEvent,
    eventArtist,
    user,
    track
  )
}

export default resolvers
