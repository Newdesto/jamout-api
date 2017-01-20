/**
 * The vogels module creates a vogels instance, promisifies it, and
 * configures AWS.
 */
import vogels from 'vogels'
import Promise from 'bluebird'

// Promisify that shit.
Promise.promisifyAll(require('vogels/lib/table').prototype)
Promise.promisifyAll(require('vogels/lib/item').prototype)
Promise.promisifyAll(require('vogels/lib/query').prototype)
Promise.promisifyAll(require('vogels/lib/scan').prototype)
Promise.promisifyAll(require('vogels/lib/parallelScan').prototype)

// Promisify our models too, bro.
let vmodel = vogels.model
vogels.model = function (name, model) {
  if (model) {
    Promise.promisifyAll(model)
  }
  return vmodel.apply(vogels, arguments)
}

Promise.promisifyAll(vogels)

// Configure AWS, dude.
vogels.AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

export default vogels
