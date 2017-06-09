import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const resolvers = {
  avatarUrl(user) {
    if (!user.avatarKey) {
      return null
    }

    const params = { Bucket: 'jamout-profile', Key: `${user.id}/avatar.png` }
    const url = s3.getSignedUrl('getObject', params)
    return url
  }
}

export default resolvers
