import merge from 'lodash/merge'
import channels from './channels'
import messages from './messages'
import release from './release'
import releases from './releases'
import studioEvent from './studioEvent'
import assistantMessages from './assistantMessages'
import musicEvent from './musicEvent'
import eventArtist from './eventArtist'
import me from './me'

const resolvers = {
  Query: merge(
    me,
    assistantMessages,
    channels,
    messages,
    release,
    releases,
    studioEvent,
    musicEvent,
    eventArtist,
  )
}

export default resolvers
