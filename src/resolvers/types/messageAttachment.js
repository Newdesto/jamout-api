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
      default:
        return null
    }
  }
}

export default resolvers
