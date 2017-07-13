import S3 from 'aws-sdk/clients/s3'
import find from 'lodash/find'
import has from 'lodash/has'

const s3 = new S3()

/**
 * Fetches the metadata for an audio object and checks if has the release-ready header.
 */

export default async function metadataCheck(event, context, callback) {
  try {
    const { record: { bucket, object } } = event
    const [ userId, trackId, type ] = object.key.split('/')

    // Get audio versions.
    const versions = await new Promise((resolve, reject) => {
      s3.listObjectVersions({
        Bucket: 'jamout.music',
        Prefix: object.key
      }, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        resolve(data.Versions)
      })
    })

    // Get the latest version.
    const latestVersion = find(versions, v => v.IsLatest)

    // Get the metadata of the latest version
    const latestMetadata = await new Promise((resolve, reject) => {
      s3.headObject({
        Bucket: 'jamout.music',
        Key: object.key,
        VersionId: latestVersion.VersionId
      }, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        resolve(data.Metadata)
      })
    })

    callback(null, {
        version: latestVersion,
        metadata: latestMetadata,
        didReleaseReadyCheck: has(latestMetadata, 'release-ready') ? true : false
    })
  } catch (err) {
    callback(err)
  }
}
