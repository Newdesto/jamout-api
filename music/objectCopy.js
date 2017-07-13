import S3 from 'aws-sdk/clients/s3'

const s3 = new S3()

/**
 * Makes a copy of the audio file with appended metadata.
 */

export default async function objectCheck(event, context, callback) {
  try {
    const { releaseReadyCheck, record: { object }, latest: { version, metadata } } = event

    // Append the releaseReady metadata by copying the object.
    const copiedObject = s3.copyObject({
      Bucket: 'jamout.music',
      Key: object.key,
      CopySource: `/jamout.music/${object.key}`, // URL encode this??
      MetadataDirective: 'REPLACE',
      Metadata: {
        ...metadata,
        'release-ready': releaseReadyCheck.success.toString(),
        'release-ready-reason': !releaseReadyCheck.success ? releaseReadyCheck.reason : udefined
      }
    }, (err, data) => {
      if (err) {
        throw err
      }
    })

    // Delete the original.
    s3.deleteObject({
      Bucket: 'jamout.music',
      Key: object.key,
      VersionId: version.VersionId
    }, (err, data) => {
      if (err) {
        throw err
      }
    })

    callback(null)
  } catch (err) {
    callback(err)
  }
}