/**
 * The vogels module creates a vogels instance, promisifies it, and
 * configures AWS.
 */
import vogels from 'vogels'
import BPromise from 'bluebird'
import DynamoDB from 'aws-sdk/clients/dynamodb'

// Promisify that shit.
BPromise.promisifyAll(require('vogels/lib/table').prototype)
BPromise.promisifyAll(require('vogels/lib/item').prototype)
BPromise.promisifyAll(require('vogels/lib/query').prototype)
BPromise.promisifyAll(require('vogels/lib/scan').prototype)
BPromise.promisifyAll(require('vogels/lib/parallelScan').prototype)

// Promisify our models too, bro.
const vmodel = vogels.model
vogels.model = function promisifyModel(...args) {
  if (args[1]) {
    BPromise.promisifyAll(args[1])
  }
  return vmodel.apply(vogels, args)
}

BPromise.promisifyAll(vogels)

// Configure the DDB endpoint.
const dynamodb = new DynamoDB({
  endpoint: process.env.DYNAMODB_ENDPOINT
})

vogels.dynamoDriver(dynamodb)

export default vogels
