import uuid from 'node-uuid'
import { getTracks } from 'gql/utils/soundcloud'
import createMusicContent from 'gql/services/music/helpers/createMusicContent'
import SNS from 'aws-sdk/clients/sns'
import { zipObj } from 'ramda'

const importAllTracks = async function importAllTracks({ user: { id: userId, soundCloudAccessToken } }) {
  if (!soundCloudAccessToken) {
    throw new Error('Missing SoundCloud Access Token. Cannot import tracks.')
  }

  const scTracks = await getTracks(soundCloudAccessToken)

    // For each track, save to our DB.
    // We don't store anythgin for future use because:
    //      - Stale data will ruin us
    //      - Costs money to store it
  const tracks = await Promise.all(scTracks.map(async (scTrack) => {
        // Save to DB.
    const track = await createMusicContent({
      userId,
      id: uuid(),
      type: 'TRACK',
      soundCloudId: scTrack.id,
      privacySetting: 'OWNER_ONLY',
      title: scTrack.title,
      artist: scTrack.user.username,
      soundCloudArtworkUrl: scTrack.artwork_url,
      soundCloudAudioUrl: scTrack.streaming_url,
      primaryGenre: scTrack.genre,

      description: scTrack.description,

            // We let the file importer set it LIVE.
      status: 'PROCESSING',

      duration: scTrack.duration,
      fileFormat: scTrack.original_format,
      fileSize: scTrack.original_content_size,

      isrc: scTrack.isrc
    })

        // Publish to SNS
    const sns = new SNS({
      endpoint: process.env.SNS_ENDPOINT
    })

    const snsMessage = {
      TopicArn: process.env.TOPIC_SOUNDCLOUD_IMPORTER_IMPORTED_TRACK_DATA,
      MessageStructure: 'json',
      Message: JSON.stringify({
        default: track.id,
        sqs: JSON.stringify({
          type: 'SOUNDCLOUD_IMPORTER_IMPORTED_TRACK_DATA',
          payload: {
            track
          }
        })
      })
    }

    await new Promise((resolve, reject) => {
      sns.publish(snsMessage, (err, data) => {
        if (err) {
          reject(err)
        }
        resolve(data)
      })
    })

    return track
  }))

    // Publish to SNS, again.
  const sns = new SNS({
    endpoint: process.env.SNS_ENDPOINT
  })

  const snsMessage = {
    TopicArn: process.env.TOPIC_SOUNDCLOUD_IMPORTER_IMPORTED_ALL_TRACKS,
    MessageStructure: 'json',
    Message: JSON.stringify({
      default: '',
      sqs: JSON.stringify({
        type: 'SOUNDCLOUD_IMPORTER_IMPORTED_ALL_TRACKS',
        payload: {
          userId,
          soundCloudAccessToken,
          trackIdMap: zipObj(tracks.map(t => t.soundCloudId), tracks.map(t => t.id))
        }
      })
    })
  }

  await new Promise((resolve, reject) => {
    sns.publish(snsMessage, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

export default importAllTracks
