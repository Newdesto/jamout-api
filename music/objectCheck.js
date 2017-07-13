import S3 from 'aws-sdk/clients/s3'
import { Asset } from 'av'

const s3 = new S3()

/**
 * Checks the actual audio file for quality.
 */

export default async function objectCheck(event, context, callback) {
  try {
    const { record: { bucket, object } } = event

    // Get the first 12 bytes so we can check if it's a WAV file.
    const contentTypeBuffer = await new Promise((resolve, reject) => {
      s3.getObject({ Bucket: bucket.name, Key: object.key, Range: "bytes=0-11" }, function(err, data) {
        if (err) resolve(err) // an error occurred
        else     resolve(data.Body);           // successful response
      })
    })

    // Check if the file is a WAV file. Kick rocks if it's not.
    if (!isWav(contentTypeBuffer)) {
      callback(null, {
        success: false,
        reason: 'Invalid file format.'
      })
    }

    // Sign a temporary get url so Aurora can get more than just 12 bytes.
    let getUrl = s3.getSignedUrl('getObject', { Bucket: 'jamout.music', Key: object.key })

    // Aurora doesn't support https:// so we need to be unsecure.
    getUrl = getUrl.replace('https', 'http')

    // Check the quality of the audio.
    const releaseReadyCheck = await checkDistributionRequirements(getUrl)

    callback(null, releaseReadyCheck)
  } catch (err) {
    callback(err)
  }
}
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
    return { success: false, reason: 'Invalid sample size.' }
  }

    // Check the sample rate.
  if (sampleRate < 44100) {
    return { success: false, reason: 'Invalid sample rate.' }
  }

    // Check the bit rate.
  const bitrate = sampleRate * channelsPerFrame * bitsPerChannel
  if (bitrate < 1411200) {
    return { success: false, reason: 'Invalid bit rate.' }
  }

  return { success: true }
}

const onError = function onError(asset) {
  return new Promise((resolve, reject) => {
    asset.on('error', err => reject(err))
  })
}

const getFormat = function getFormat(asset) {
  return new Promise((resolve, reject) => {
    asset.get('format',  resolve)
  })
}

// https://github.com/hemanth/is-wav/blob/master/index.js
const isWav = function isWav(buf) {
	if (!buf || buf.length < 12) {
		return false
	}

	return buf[0] === 82 &&
		buf[1] === 73 &&
		buf[2] === 70 &&
		buf[3] === 70 &&
		buf[8] === 87 &&
		buf[9] === 65 &&
		buf[10] === 86 &&
		buf[11] === 69
}