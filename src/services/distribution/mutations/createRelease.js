import uuid from 'node-uuid'
import SNS from 'aws-sdk/clients/sns'
import Release from '../models/Release'

const createRelease = async function createRelease(root, { contentId, input }, { viewer }) {
  if (!viewer) {
    throw new Error('Authentication failed.')
  }

  const { attrs: release } = await Release.createAsync({
    ...input,
    contentId,
    id: uuid(),
    userId: viewer.id
  })

  // Publish updateRelease event for listeners like
  // notifier and soundcloud-importer.
  const sns = new SNS({
    endpoint: process.env.SNS_ENDPOINT
  })

  const snsMessage = {
    TopicArn: process.env.TOPIC_DISTRIBUTION_CREATED_RELEASE,
    MessageStructure: 'json',
    Message: JSON.stringify({
      default: release.id,
      sqs: JSON.stringify({
        type: 'DISTRIBUTION_CREATED_RELEASE',
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

export default createRelease
