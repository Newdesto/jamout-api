import S3 from 'aws-sdk/clients/s3'

const s3 = new S3()
const resolvers = {
  artworkOriginal(attachment) {
    if (attachment.artworkOriginalS3Key) {
      const params = { Bucket: 'jamout-distribution', Key: attachment.artworkOriginalS3Key }
      const url = s3.getSignedUrl('getObject', params)
      return url
    }

    return null
  }
}

export default resolvers
