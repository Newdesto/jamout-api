const resolvers = {
  __resolveType(attachment) {
    switch (attachment.type) {
      case 'Image':
        return 'ImageAttachment'
      case 'CardGroup':
        return 'CardGroupAttachment'
      case 'ReleaseType':
        return 'ReleaseTypeAttachment'
      case 'ReleaseMetadata':
        return 'ReleaseMetadataAttachment'
      case 'ReleaseArtwork':
        return 'ReleaseArtworkAttachment'
      case 'ReleaseTracklist':
        return 'ReleaseTracklistAttachment'
      case 'ReleaseConfirmAndPay':
        return 'ReleaseConfirmAndPayAttachment'
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
