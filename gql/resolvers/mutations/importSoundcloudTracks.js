import StepFunctions from 'aws-sdk/clients/stepfunctions'

const stepFunctions = new StepFunctions()

/**
 * Takes an array of SoundCloud track IDs and start a
 * SoundcloudImporter State Machine.
 * @TODO Check that the tracks belong to the viewer.
 */
export default async function importSoundcloudTracks(root, args, { viewer }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }

  const { trackIds } = args
  const { id: userId } = viewer

  const executions = await Promise.all(trackIds.map(soundcloudTrackId => new Promise((resolve, reject) => {
    stepFunctions.startExecution({
      stateMachineArn: process.env.soundcloudImporterStateMachineArn,
      input: JSON.stringify({
        userId,
        soundcloudTrackId
      })
    }, (err, data) => {
      if (err) {
        reject(err)
      }

      resolve(data)
    })
  })))

  return JSON.stringify(executions)
}
