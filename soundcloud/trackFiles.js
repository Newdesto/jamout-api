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

/**
 * Streams the artwork/audio for a track from SoundCloud and to S3.
 */

export default async function trackFiles(event, context, callback) {
  try {
    const { jamoutTrack: track } = event

    // Notice the lack of file extension.
    const audioS3Key = `${track.userId}/${track.id}/audio`
    const artworkS3Key = `${track.userId}/${track.id}/artwork`

    // Users should be cached for speed!
    const user = await getUserById(track.userId)

    // Get the current downloadable setting.
    let scTrack = await getTrack(track.soundCloudId, user.soundcloudAccessToken)
    const originalDownloadableSetting = scTrack.downloadable

    // If the track isn't set to downloadable change that.
    if (originalDownloadableSetting) {
      scTrack = await updateTrack({
        id: track.soundCloudId,
        token: user.soundcloudAccessToken,
        updates: {
          downloadable: true
        }
      })
    }


      // Prep the s3 streamer
    const streamer = S3Stream(new S3())

    const audioStreamer = streamer.upload({
      Bucket: 'jamout.music',
      Key: audioS3Key,
      ContentType: `audio/${scTrack.original_format}`,
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
        oauth_token: user.soundcloudAccessToken,
        client_id: '04b907cb25364f6f9883bae690cf9c4a' // Move to env.
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

      // If the original downloadable setting was false let's
      // set it back to false.
    if (!originalDownloadableSetting) {
      scTrack = await updateTrack({
        id: track.soundCloudId,
        token: user.soundcloudAccessToken,
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
        Bucket: 'jamout.music',
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
          oauth_token: user.soundcloudAccessToken,
          client_id: '04b907cb25364f6f9883bae690cf9c4a'
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

    callback(null, {
      jamoutTrack: updatedTrack // This will overwrite the input.
    })
  } catch (err) {
    callback(err)
  }
}
