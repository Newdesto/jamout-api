import AWS from 'aws-sdk'
const s3 = new AWS.S3()

const resolver = {
  url(attachment, args, context) {
    if (attachment.url) {
      return attachment.url
    }

    // @TODO Provision an s3 link for the key property.

  }
}

export default resolver
