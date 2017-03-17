/**
 * The vogels module creates a vogels instance, promisifies it, and
 * configures AWS.
 */
import vogels from 'vogels'
import BPromise from 'bluebird'

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

// Configure AWS, dude.
vogels.AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

export default vogels
