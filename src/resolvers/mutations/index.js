import merge from 'lodash/merge'
import generateS3Signature from './generateS3Signature'
import openChannel from './openChannel'
import sendMessage from './sendMessage'
import release from './release'
import signUp from './signUp'
import sendAssistantMessage from './sendAssistantMessage'

const resolvers = {
  Mutation: merge(
    signUp,
    sendAssistantMessage,
    generateS3Signature,
    openChannel,
    sendMessage,
    release
  )
}

export default resolvers
