/**
 * Resolvers for the AssistantMessage
 */

const resolver = {
  type(assistantMessage, args, context) {
    // @NOTE we hijack the type so if its set it will be overwritten
    return 'message'
  },
  sender(assistantMessage, args, context) {
    const sender = {
      a: 'ASSISTANT',
      u: 'USER'
    }[assistantMessage.sender]

    return sender
  }
}

export default resolver
