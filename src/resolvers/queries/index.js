import merge from 'lodash/merge'
import channels from './channels'
import messages from './messages'
import release from './release'
import releases from './releases'
import studioEvent from './studioEvent'
import musicEvent from './musicEvent'
import eventArtist from './eventArtist'
import me from './me'
import profile from './profile'
import track from './track'

const resolvers = {
  Query: merge(
    me,
    channels,
    messages,
    release,
    releases,
    studioEvent,
    musicEvent,
    eventArtist,
    profile,
    track
  )
}

export default resolvers
