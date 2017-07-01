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

    const ret = await Promise.all(versions.map(async (v) => {
      // Get metadata for this version.
      const metadata = await new Promise((resolve, reject) => {
        s3.headObject({
          Bucket: 'jamout-music',
          Key: `${viewer.id}/${musicContent.id}/artwork`,
          VersionId: v.VersionId
        }, (err, data) => {
          if (err) {
            console.error(err)
            return resolve(null)
          }
          console.log(typeof data)
          if (data === null) {
            resolve(null)
          }
          resolve(data.Metadata)
        })
      })

      return {
        metadata,
        size: v.Size,
        eTag: v.ETag,
        lastModified: v.LastModified,
        isLatest: v.IsLatest,
        versionId: v.VersionId
      }
    }))

    return ret
  },
  async audioVersions(musicContent, args, { viewer }) {
    const versions = await new Promise((resolve, reject) => {
      s3.listObjectVersions({
        Bucket: 'jamout-music',
        Prefix: `${viewer.id}/${musicContent.id}/audio`
      }, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        resolve(data.Versions)
      })
    })

    console.log(versions)


    const ret = await Promise.all(versions.map(async (v) => {
      // Get metadata for this version.
      const metadata = await new Promise((resolve, reject) => {
        s3.headObject({
          Bucket: 'jamout-music',
          Key: `${viewer.id}/${musicContent.id}/audio`,
          VersionId: v.VersionId
        }, (err, data) => {
          if (err) {
            console.error(err)
            return resolve(null)
          }
          console.log(typeof data)
          if (data === null) {
            resolve(null)
          }
          resolve(data.Metadata)
        })
      })

      return {
        metadata,
        size: v.Size,
        eTag: v.ETag,
        lastModified: v.LastModified,
        isLatest: v.IsLatest,
        versionId: v.VersionId
      }
    }))

    return ret
  }
}

export default resolvers
