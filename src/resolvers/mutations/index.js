import merge from 'lodash/merge'
import generateS3Signature from './generateS3Signature'
import openChannel from './openChannel'
import sendMessage from './sendMessage'
import release from './release'
import signUp from './signUp'
import studioEvent from './studioEvent'
import updateAssistantContext from './updateAssistantContext'
import sendAssistantMessage from './sendAssistantMessage'
import postback from './postback'
import createMusicEvent from './musicEvent'
import eventArtist from './eventArtist'

const resolvers = {
  Mutation: merge(
    signUp,
    updateAssistantContext,
    sendAssistantMessage,
    generateS3Signature,
    openChannel,
    sendMessage,
    release,
    studioEvent,
    postback,
    createMusicEvent,
    eventArtist,
  )
}

export default resolvers
