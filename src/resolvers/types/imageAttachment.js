const resolvers = {
  src(attachment) {
    if (attachment.src) {
      return attachment.src
    }

    // @TODO Provision an s3 link for the key property.
    return null
  }
}

export default resolvers
