import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const resolver = {
  url(attachment) {
    if (!attachment.bucket || !attachment.key) {
      return null
    }
    const params = { Bucket: attachment.bucket, Key: attachment.key }
    const url = s3.getSignedUrl('getObject', params)
    return url
  }
}

export default resolver
