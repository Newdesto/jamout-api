import AWS from 'aws-sdk'
import dynamodbTables from './dynamodb-tables'

const main  = async function main() {
    try {
            console.log('Waiting 10 seconds to allow fake-aws to initialize.')
    await new Promise(resolve => setTimeout(resolve, 10000))

    // fake-aws doesn't support ssl.. duh.
    AWS.config.update({
        sslEnabled: false
    })

    // Create the SNS topics.
    const sns = new AWS.SNS({
        endpoint: process.env.SNS_ENDPOINT
    })

    const topics = [
        'chat-sentMessages',
        'chat-updatedMessages'
    ]

    await Promise.all(topics.map(topic => new Promise((resolve, reject) => sns.createTopic({
        Name: topic
    }, (err, data) => {
        if (err) {
            reject(err)
        }

        resolve(data)
    }))))

    // Create the SQS topics.
    const sqs = new AWS.SQS({
        endpoint: process.env.SQS_ENDPOINT
    })

    const queues = [
        'bot-sentMessages',
        'iam-updatedMessages'
    ]

    await Promise.all(queues.map(queue => new Promise((resolve, reject) => sqs.createQueue({
        QueueName: queue
    }, (err, data) => {
        if (err) {
            reject(err)
        }

        resolve(data)
    }))))

    // Create sns -> sqs susbcriptions.
    const subscriptions = [
        [ 'arn:aws:sns:local:000000000000:chat-sentMessages', 'http://sqs.us-west-1.amazonaws.com:4100/queue/bot-sentMessages' ],
        [ 'arn:aws:sns:local:000000000000:chat-updatedMessages', 'http://sqs.us-west-1.amazonaws.com:4100/queue/iam-updatedMessages' ]
    ]

    const subscriptionArns = await Promise.all(subscriptions.map(([ topic, queue ]) => new Promise((resolve, reject) => sns.subscribe({
        TopicArn: topic,
        Protocol: 'sqs',
        Endpoint: queue
    }, (err, data) => {
        if (err) {
            reject(err)
        }

        resolve(data.SubscriptionArn)
    }))))

    // Set the subscriptions to RAW delivery.
    await Promise.all(subscriptionArns.map(SubscriptionArn => new Promise((resolve, reject) => sns.setSubscriptionAttributes({
        SubscriptionArn,
        AttributeName: 'RawMessageDelivery',
        AttributeValue: 'true'
    }, (err, data) => {
        if (err) {
            console.error(err)
            reject(err)
        }
        console.log(data)
        resolve(data)
    }))))

    // Setup S3 buckets
    const s3 = new AWS.S3({
        accessKeyId: 'accessKey1',
        secretAccessKey: 'verySecretKey1',
        endpoint: process.env.S3_ENDPOINT,
        sslEnabled: false,
        s3ForcePathStyle: true,
        region: 'us-east-1'
    })

    const buckets = [
        'jamout-distribution',
    ]
 
    await Promise.all(buckets.map(Bucket => new Promise((resolve, reject) => s3.createBucket({ Bucket }, (err, data) => {
        if (err) {
            reject(err)
        }

        resolve(data)
    }))))

    // Setup DynamoDB tables.
    const dynamodb = new AWS.DynamoDB({
        endpoint: process.env.DYNAMODB_ENDPOINT
    })

    const existingTables = await new Promise((resolve, reject) => dynamodb.listTables({}, (err, data) => {
        if (err) {
            reject(err)
        }

        resolve(data.TableNames)
    }))

    const nonExistingTables = dynamodbTables.filter(({ TableName }) => !existingTables.includes(TableName))
    
    await Promise.all(nonExistingTables.map(table => new Promise((resolve, reject) => dynamodb.createTable(table, (err, data) => {
        if (err) {
            reject(err)
        }

        resolve(data)
    }))))

    // Start the dynamodb-admin dashboard.
    require('dynamodb-admin')
    } catch (err) {
        console.error(err.message)
        console.error(err.stack)
    }
}

main()