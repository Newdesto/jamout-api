import uuid from 'node-uuid'
import { getTracks } from 'utils/soundcloud'
import getTrackById from 'services/music/helpers/getTrackById'
import SNS from 'aws-sdk/clients/sns'
import { zipObj } from 'ramda'

const importAllTracks = async function importAllTracks({ release }) {
    if (!release) {
        throw new Error('Missing Release object.. Cannot import track files.')
    }

    release.tracklist.map(async function(releaseTrack) {
        // Get the track from the DB.
        // Assumes the user owns the track.
        const track = getTrackById({
            userId: release.userId
        })
        // Does this release track have a version set?

    })

    // For each track in the tracklist:
        // Get track from DB
        // Does track audio key have versions?
            // Yes - does the version exist in S3
                // No - Is there an SC URL
                    // Yes - download it and set it to latest version
                    // No - Throw error
            // No - is there a SC URL
                // Yes - download it and set it to latest version
                // No - Throw error

    // Do same for artwork
}

export default importAllTracks