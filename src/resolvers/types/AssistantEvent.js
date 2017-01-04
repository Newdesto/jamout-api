const resolver = {
  __resolveType(root, context, info) {
    switch(root.type) {
      case 'typing.start':
      case 'typing.stop':
        return 'AssistantTyping'
      case 'message.text':
      case 'message.card':
        return 'AssistantMessage'
      case 'input':
        return 'AssistantInput'
      default:
        null
    }
  }
}

export default resolver
