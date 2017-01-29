const resolvers = {
  __resolveType(attachment) {
    switch (attachment.type) {
      case 'Image':
        return 'ImageAttachment'
      case 'CardGroup':
        return 'CardGroupAttachment'
      default:
        return null
    }
  }
}

export default resolvers
