const resolvers = {
  __resolveType(attachment) {
    switch (attachment.type) {
      case 'Image':
        return 'ImageAttachment'
      case 'CardGroup':
        return 'CardGroupAttachment'
      case 'EditRelease':
        return 'EditReleaseAttachment'
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
