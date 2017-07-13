import StepFunctions from 'aws-sdk/clients/stepfunctions'

const stepFunctions = new StepFunctions()

/**
 * Makes a copy of the audio file with appended metadata.
 */

export default async function triggerReleaseReadinessChecker(event, context, callback) {
  try {
    const { Records } = event

    const executions = await Promise.all(Records.map(record => new Promise((resolve, reject) => {
      stepFunctions.startExecution({
        stateMachineArn: process.env.musicReleaseReadinessCheckerArn,
        input: JSON.stringify({
          record: record.s3
        })
      }, (err, data) => {
        if (err) {
          reject(err)
        }

        resolve(data)
      })
    })))
    .then(executions => callback(null, executions))
    .catch(err => { throw err })

  } catch (err) {
    callback(err)
  }
}