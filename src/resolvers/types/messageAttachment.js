const resolvers = {
  __resolveType(attachment) {
    switch (attachment.type) {
      case 'Image':
        return 'ImageAttachment'
      case 'CardGroup':
        return 'CardGroupAttachment'
      case 'StudioSessionInquiry':
        return 'StudioSessionInquiryAttachment'
      case 'Event':
        return 'EventAttachment'
      default:
        return null
    }
  }
}

export default resolvers
