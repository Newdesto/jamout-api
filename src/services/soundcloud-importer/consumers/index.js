import Consumer from 'sqs-consumer'
import logger from 'io/logger'
import importAllTracks from './importAllTracks'
import importAllPlaylists from './importAllPlaylists'
import importTrackFiles from './importTrackFiles'

const app = Consumer.create({
  queueUrl: process.env.QUEUE_SOUNDCLOUD_IMPORTER,
  async handleMessage({ MessageId, Body }, done) {
    try {
      const body = JSON.parse(Body)
      const message = body.sqs ? JSON.parse(body.sqs) : body

      logger.debug(message.type)
      logger.debug(message.payload)

      // Route to the right consumer...
      switch(message.type) {
          // Import all the track data when an new user signs up.
          case 'IAM_SIGNED_UP':
            await importAllTracks(message.payload)
            break
          // Import the playlist when all their track data imported.
         case 'SOUNDCLOUD_IMPORTER_IMPORTED_ALL_TRACKS':
            await importAllPlaylists(message.payload)
            break
         case 'SOUNDCLOUD_IMPORTER_IMPORTED_TRACK_DATA':
            await importTrackFiles(message.payload)
         // Import the track files when a user submits a release.
         case 'DISTRIBUTION_SUBMITTED_RELEASE':
            //await importTrackFilesForRelease(message.payload)
            break
      }

      done()

    } catch (err) {
      logger.error(err)
      done(err)
    }
  }
})

app.on('error', (err) => {
  console.error(err)
})

app.start()