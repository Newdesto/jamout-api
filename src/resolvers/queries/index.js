import merge from 'lodash/merge'
import channels from './channels'
import messages from './messages'
import release from './release'
import releases from './releases'
import studioEvent from './studioEvent'
import assistantMessages from './assistantMessages'

const resolvers = {
  Query: merge(
    assistantMessages,
    channels,
    messages,
    release,
    releases,
    studioEvent,
  )
}

export default resolvers
