import uuid from 'node-uuid'
import SNS from 'aws-sdk/clients/sns'
import updateReleaseHelper from '../helpers/updateRelease'

const updateRelease = async function updateRelease(root, { contentId, input }, { viewer }) {
    // Save to DB
  const release = await updateReleaseHelper({
    contentId,
    updates: input,
    userId: viewer.id
  })

     // Publish updateRelease event for listeners like
     // notifier and soundcloud-importer.
  const sns = new SNS({
    endpoint: process.env.SNS_ENDPOINT
  })

  const snsMessage = {
    TopicArn: process.env.TOPIC_DISTRIBUTION_UPDATE_RELEASE,
    MessageStructure: 'json',
    Message: JSON.stringify({
      default: release.id,
      sqs: JSON.stringify({
        type: 'distribution--updateRelease',
        payload: {
          release
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

  return release
}

export default updateRelease
