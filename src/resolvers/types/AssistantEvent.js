const resolver = {
  __resolveType(root, context, info) {
    switch(root.type) {
      case 'typing.start':
      case 'typing.stop':
        return 'AssistantTyping'
      case 'message':
        return 'AssistantMessage'
      default:
        null
    }
  }
}

export default resolver
