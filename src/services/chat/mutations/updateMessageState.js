import SNS from 'aws-sdk/clients/sns'
import updateMessage from '../helpers/updateMessage'

const updateMessageState =
    async function updateMessageState(
      root,
      { channelId, timestamp, messageState, action },
      { viewer }
    ) {
      if (!viewer) {
        throw new Error('Authentication failed.')
      }

        // Update the message state in DDB.
      const message = await updateMessage(channelId, timestamp, { messageState })

        // Publish the message to the SNS topic.
        // @NOTE We have to override the endpoint set by DDB.
      const sns = new SNS({
        endpoint: process.env.SNS_ENDPOINT
      })

        // We have to stringify both the SQS message and the SNS message.
      const snsMessage = {
        TopicArn: process.env.TOPIC_UPDATED_MESSAGES,
        MessageStructure: 'json',
        Message: JSON.stringify({
          default: message.id,
          sqs: JSON.stringify({ message, action })
        })
      }

        // Publish.
        // @TODO Error handling if it fails to publish.
      await new Promise((resolve, reject) => {
        sns.publish(snsMessage, (err, data) => {
          if (err) {
            reject(err)
          }
          resolve(data)
        })
      })

      return message
    }

export default updateMessageState
