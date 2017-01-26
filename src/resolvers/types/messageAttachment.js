const resolver = {
  url(attachment) {
    if (attachment.url) {
      return attachment.url
    }

    // @TODO Provision an s3 link for the key property.
    return null
  }
}

export default resolver
