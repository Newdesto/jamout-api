import uuid from 'node-uuid'
import { getTrack } from 'gql/utils/soundcloud'
import User from 'models/User'
import createMusicContent from 'gql/services/music/helpers/createMusicContent'

/**
 * Fetches the metadata for a track from SoundCloud and creates
 * an item in DynamoDB.
 */

export default async function trackMetadata(event, context, callback) {
  try {
    const { devMode, userId, soundcloudTrackId } = event

    // Get the user object from DynamoDB.
    const user = await new User(devMode).getUserById(userId)

    // Get the track object from SoundCloud
    const soundcloudTrack = await getTrack(soundcloudTrackId, user.soundcloudAccessToken)

    // Map the track and save!
    const jamoutTrack = await createMusicContent({
      userId,
      id: uuid(),
      type: 'TRACK',
      soundCloudId: soundcloudTrack.id,
      privacySetting: 'OWNER_ONLY',
      title: soundcloudTrack.title,
      artist: soundcloudTrack.user.username, // Should we default to Jamout display name?
      soundCloudArtworkUrl: soundcloudTrack.artwork_url,
      soundCloudAudioUrl: soundcloudTrack.streaming_url,
      primaryGenre: soundcloudTrack.genre,

      description: soundcloudTrack.description,

      // We let the file importer set it LIVE.
      // Do we say IMPORTING instead of PROCESSING
      status: 'PROCESSING',

      duration: soundcloudTrack.duration,
      fileFormat: soundcloudTrack.original_format,
      fileSize: soundcloudTrack.original_content_size,

      isrc: soundcloudTrack.isrc
    })

    callback(null, {
      ...event,
      soundcloudTrack,
      jamoutTrack
    })
  } catch (err) {
    callback(err)
  }
}
