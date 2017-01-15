import merge from 'lodash/merge'
import generateS3Signature from './generateS3Signature'
import chat from './chat'
import sendMessage from './sendMessage'
import release from './release'
import login from './login'
import signUp from './signUp'
import updateAssistantContext from './updateAssistantContext'
import sendAssistantMessage from './sendAssistantMessage'

const resolvers = {
  Mutation: merge(
    login,
    signUp,
    updateAssistantContext,
    sendAssistantMessage,
    generateS3Signature,
    chat,
    release
  )
}

export default resolvers
