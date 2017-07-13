import S3 from 'aws-sdk/clients/s3'
import _ from 'lodash'
import { Asset } from 'av'

export const checkDistributionRequirements =
async function checkDistributionRequirements(url) {
  const asset = Asset.fromURL(url)

    // Throw the error or get the format, whichever resolves first.
  const { bitsPerChannel, channelsPerFrame, sampleRate } = await Promise.race([
    onError(asset),
    getFormat(asset)
  ])

    // Check the sample size.
  if (bitsPerChannel < 16) {
    throw new Error('Invalid sample size.')
  }

    // Check the sample rate.
  if (sampleRate < 44100) {
    throw new Error('Invalid sample rate.')
  }

    // Check the bit rate.
  const bitrate = sampleRate * channelsPerFrame * bitsPerChannel
  if (bitrate < 1411200) {
    throw new Error('Invalid bit rate.')
  }

  return true
}

const onError = function onError(asset) {
  return new Promise((resolve, reject) => {
    asset.on('error', err => reject(err))
  })
}

const getFormat = function getFormat(asset) {
  return new Promise((resolve, reject) => {
    asset.get('format', format => resolve(format))
  })
}

const releaseReadyCheck = async function releaseReadyCheck(key) {
  console.log(key)
  const [userId, trackId, type] = key.split('/')
  console.log(userId)
  console.log(trackId)
  console.log(type)
  if (type === 'audio') {
    const s3 = new S3()
    let getUrl = s3.getSignedUrl('getObject', { Bucket: 'jamout-music', Key: key })
    getUrl = getUrl.replace('https', 'http')
    // Get latest version of audio.
    const versions = await new Promise((resolve, reject) => {
      s3.listObjectVersions({
        Bucket: 'jamout-music',
        Prefix: key
      }, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        resolve(data.Versions)
      })
    })

    console.log(versions)
    const latestVersion = _.find(versions, v => v.IsLatest)
    console.log(latestVersion)

    // Get the metadata of the latest version. Did we check for quality?
    const latestMetadata = await new Promise((resolve, reject) => {
      s3.headObject({
        Bucket: 'jamout-music',
        Key: key,
        VersionId: latestVersion.VersionId
      }, (err, data) => {
        if (err) {
          console.error(err)
          reject(err)
        }

        resolve(data.Metadata)
      })
    })

    console.log(latestMetadata)

    // NOTE Camel casing isn't maintained.
    if (latestMetadata['release-ready']) {
      return true
    }

    try {
      const releaseReady = await checkDistributionRequirements(getUrl)
      const copiedObject = s3.copyObject({
        Bucket: 'jamout-music',
        Key: key,
        CopySource: `/jamout-music/${key}`,
        MetadataDirective: 'REPLACE',
        Metadata: {
          'release-ready': 'true'
        }
      }, (err, data) => {
        if (err) console.log(err, err.stack) // an error occurred
        else console.log(data)           // successful response
      })
    } catch (err) {
      console.log(err)
      const copiedObject = s3.copyObject({
        Bucket: 'jamout-music',
        Key: key,
        CopySource: `/jamout-music/${key}`,
        MetadataDirective: 'REPLACE',
        Metadata: {
          'release-ready': 'false',
          'release-ready-reason': err.message
        }
      }, (err, data) => {
        if (err) console.log(err, err.stack) // an error occurred
        else console.log(data)           // successful response
      })
    }


    // Delete the version that isn't checked.
    s3.deleteObject({
      Bucket: 'jamout-music',
      Key: key,
      VersionId: latestVersion.VersionId
    }, (err, data) => {
      if (err) console.log(err, err.stack) // an error occurred
      else console.log(data)           // successful response
    })
  }
}

export default releaseReadyCheck
