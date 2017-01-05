/**
 * Resolvers for the AssistantMessage
 */

const resolver = {
  sender(assistantMessage, args, context) {
    const sender = {
      a: 'ASSISTANT',
      u: 'USER'
    }[assistantMessage.sender]

    return sender
  }
}

export default resolver
