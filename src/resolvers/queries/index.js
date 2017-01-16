import merge from 'lodash/merge'
import channels from './channels'
import messages from './messages'
import release from './release'
import releases from './releases'
import assistantMessages from './assistantMessages'
import me from './me'

const resolvers = {
  Query: merge(
    me,
    assistantMessages,
    channels,
    messages,
    release,
    releases
  )
}
export default resolvers
