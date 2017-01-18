import merge from 'lodash/merge'
import generateS3Signature from './generateS3Signature'
import chat from './chat'
import sendMessage from './sendMessage'
import release from './release'
import authentication from './authentication'
import login from './login'
import signUp from './signUp'
import studioEvent from './studioEvent'
import updateAssistantContext from './updateAssistantContext'
import sendAssistantMessage from './sendAssistantMessage'
import createMusicEvent from './musicEvent'
import eventArtist from './eventArtist'


const resolvers = {
  Mutation: merge(
    authentication,
    updateAssistantContext,
    sendAssistantMessage,
    generateS3Signature,
    studioEvent,
    createMusicEvent,
    eventArtist,
    chat,
    release
  )
}

export default resolvers
