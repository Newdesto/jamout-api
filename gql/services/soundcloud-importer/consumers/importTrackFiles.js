import uuid from 'node-uuid'
import { getTrack, updateTrack } from 'gql/utils/soundcloud'
import getMusicContentById from 'gql/services/music/helpers/getMusicContentById'
import updateMusicContentById from 'gql/services/music/helpers/updateMusicContentById'
import getUserById from 'gql/services/iam/helpers/getUserById'
import S3 from 'aws-sdk/clients/s3'
import { zipObj } from 'ramda'
import request from 'request'
import S3Stream from 's3-upload-stream'
import logger from 'gql/io/logger'

const importTrackFiles = async function importTrackFiles({ track }) {
  if (!track) {
    throw new Error('Missing Track object. Cannot import track files.')
  }

    // Notice the lack of file extension.
  const audioS3Key = `${track.userId}/${track.id}/audio`
  const artworkS3Key = `${track.userId}/${track.id}/artwork`

    // Assumes preset track.status === PROCESSING

    // Get the access token.
  const user = await getUserById(track.userId)

    // Get the current downloadable setting.
  let scTrack = await getTrack(track.soundCloudId, user.soundCloudAccessToken)
  const originalDownloadableSetting = scTrack.downloadable

    // If the track isn't set to downloadable change that.
  if (originalDownloadableSetting) {
    scTrack = await updateTrack({
      id: track.soundCloudId,
      token: user.soundCloudAccessToken,
      updates: {
        downloadable: true
      }
    })
  }


    // Prep the s3 streamer
  const streamer = S3Stream(new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.S3_ENDPOINT,
    sslEnabled: false,
    s3ForcePathStyle: true,
    region: 'us-west-1'
  }))

  const audioStreamer = streamer.upload({
    Bucket: 'jamout-music',
    Key: audioS3Key,
    ContentType: `audgql/io/${scTrack.original_format}`,
    ACL: 'private',
    Metadata: {
      userId: track.userId,
      trackId: track.id,
      soundCloudId: track.soundCloudId.toString()
    }
  })

    // Log any progress.
  audioStreamer.on('part', logger.debug)

    // Start the file request from SoundCloud.
  request({
    uri: scTrack.download_url,
    qs: {
      oauth_token: user.soundCloudAccessToken,
      client_id: 'c1e16bd8c1d45d02868f65a5cecf9d62'
    }
  }).pipe(audioStreamer)

    // Wait for the upload to finish.
  const audioUpload = await new Promise((resolve, reject) => {
    audioStreamer.on('error', (err) => {
      console.error(err)
      reject(err)
    })


    audioStreamer.on('uploaded', resolve)
  })

    // If the original downloadble setting was false let's
    // set it back to false.
  if (!originalDownloadableSetting) {
    scTrack = await updateTrack({
      id: track.soundCloudId,
      token: user.soundCloudAccessToken,
      updates: {
        downloadable: false
      }
    })
  }

    // Let's also stream the artwork to s3 - IF THERE IS ARTWORK.
    // There aren't any settings to change so this can be left
    // last or added to another queue for image resizing.
    // We can probably import all the artwork files from SoundCloud
    // but let's just stick with the large format for now.
  if (scTrack.artwork_url) {
    const artworkStreamer = streamer.upload({
      Bucket: 'jamout-music',
      Key: artworkS3Key,
      ContentType: 'image/jpeg',
      ACL: 'private',
      Metadata: {
        userId: track.userId,
        trackId: track.id,
        soundCloudId: track.soundCloudId.toString()
      }
    })

        // Log any progress.
    artworkStreamer.on('part', logger.debug)

        // Start the file request from SoundCloud.
    request({
      uri: scTrack.artwork_url,
      qs: {
        oauth_token: user.soundCloudAccessToken,
        client_id: 'c1e16bd8c1d45d02868f65a5cecf9d62'
      }
    }).pipe(artworkStreamer)

        // Wait for the upload to finish.
    const artworkUpload = await new Promise((resolve, reject) => {
      artworkStreamer.on('error', (err) => {
        console.error(err)
        reject(err)
      })


      artworkStreamer.on('uploaded', resolve)
    })
  }

    // Done!
    // Let's set this tracks status to LIVE.
  const updatedTrack = await updateMusicContentById({
    id: track.id,
    userId: track.userId,
    updates: {
      status: 'LIVE'
    }
  })
}

export default importTrackFiles
