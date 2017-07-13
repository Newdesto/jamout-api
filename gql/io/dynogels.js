/**
 * The dynogels module creates a dynogels instance, promisifies it, and
 * configures AWS.
 */
import dynogels from 'dynogels'
import BPromise from 'bluebird'

// Our DB is in us-west-1
dynogels.AWS.config.update({region: "us-west-1"})

// Promisify that shit.
BPromise.promisifyAll(require('dynogels/lib/table').prototype)
BPromise.promisifyAll(require('dynogels/lib/item').prototype)
BPromise.promisifyAll(require('dynogels/lib/query').prototype)
BPromise.promisifyAll(require('dynogels/lib/scan').prototype)
BPromise.promisifyAll(require('dynogels/lib/parallelScan').prototype)

// Promisify our models too, bro.
const vmodel = dynogels.model
dynogels.model = function promisifyModel(...args) {
  if (args[1]) {
    BPromise.promisifyAll(args[1])
  }
  return vmodel.apply(dynogels, args)
}

BPromise.promisifyAll(dynogels)

export default dynogels
