import uuid from 'node-uuid'
import SNS from 'aws-sdk/clients/sns'
import { getPlaylists } from 'utils/soundcloud'
import createPlaylist from 'services/music/helpers/createPlaylist'

const importAllTracks = async function importAllTracks({ userId, soundCloudAccessToken, trackIdMap }) {
  if (!soundCloudAccessToken || !userId || !trackIdMap) {
    throw new Error('Missing key arguments. Cannot import tracks.')
  }

  const scPlaylists = await getPlaylists(soundCloudAccessToken)

  const playlists = await Promise.all(scPlaylists.map(async (scPlaylist) => {
        // Save in DB.
    const playlist = await createPlaylist({
      userId,
      id: uuid(),
      soundCloudId: scPlaylist.id,
      soundCloudType: scPlaylist.type,
      privacySetting: 'OWNER_ONLY',
      title: scPlaylist.title,
      artist: scPlaylist.user.username,
      soundCloudArtworkUrl: scPlaylist.artwork_url,
      description: scPlaylist.description,
      duration: scPlaylist.duration,
      ean: scPlaylist.ean,
      tracks: scPlaylist.tracks.map(t => trackIdMap[t.id])
    })

        // Publish to SNS.
    const sns = new SNS({
      endpoint: process.env.SNS_ENDPOINT
    })

    const snsMessage = {
      TopicArn: process.env.TOPIC_SOUNDCLOUD_IMPORTER_IMPORTED_PLAYLIST_DATA,
      MessageStructure: 'json',
      Message: JSON.stringify({
        default: userId,
        sqs: JSON.stringify({
          type: 'SOUNDCLOUD_IMPORTER_IMPORTED_PLAYLIST_DATA',
          payload: {
            playlist
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
  }))
}

export default importAllTracks
