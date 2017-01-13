import merge from 'lodash/merge'
import generateS3Signature from './generateS3Signature'
import openChannel from './openChannel'
import sendMessage from './sendMessage'
import release from './release'
import signUp from './signUp'
import updateAssistantContext from './updateAssistantContext'
import sendAssistantMessage from './sendAssistantMessage'
import postback from './postback'
import assistantInput from './assistantInput'

const resolvers = {
  Mutation: merge(
    signUp,
    updateAssistantContext,
    sendAssistantMessage,
    generateS3Signature,
    openChannel,
    sendMessage,
    release,
    postback,
    assistantInput
  )
}

export default resolvers
