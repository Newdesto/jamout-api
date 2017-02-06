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
      case 'StudioSessionNewDate':
        return 'StudioSessionNewDateAttatchment'
      case 'StudioSessionSetDate':
        return 'StudioSessionSetDateAttatchment'
      case 'StudioSessionNewSession':
        return 'StudioSessionNewSessionAttatchment'
      case 'StudioSessionPaid':
        return 'StudioSessionSessionPaidAttatchment'
      default:
        return null
    }
  }
}

export default resolvers
