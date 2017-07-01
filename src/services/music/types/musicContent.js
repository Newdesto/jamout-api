import AWS from 'aws-sdk'

const s3 = new AWS.S3()

const resolvers = {
  async artworkVersions(musicContent, args, { viewer }) {
    const versions = await new Promise((resolve, reject) => {
      s3.listObjectVersions({
        Bucket: 'jamout-music',
        Prefix: `${viewer.id}/${musicContent.id}/artwork`
      }, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        resolve(data.Versions)
      })
    })

    return versions.map(v => ({
      size: v.Size,
      eTag: v.ETag,
      lastModified: v.LastModified,
      isLatest: v.IsLatest,
      versionId: v.VersionId
    }))
  },
  async audioVersions(musicContent, args, { viewer }) {
    const versions = await new Promise((resolve, reject) => {
      s3.listObjectVersions({
        Bucket: 'jamout-music',
        Prefix: `${viewer.id}/${musicContent.id}/track`
      }, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        resolve(data.Versions)
      })
    })

    return versions.map(v => ({
      size: v.Size,
      eTag: v.ETag,
      lastModified: v.LastModified,
      isLatest: v.IsLatest,
      versionId: v.VersionId
    }))
  }
}

export default resolvers
