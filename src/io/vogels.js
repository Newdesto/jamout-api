/**
 * Promisifies vogels and connects to DynamoDB
 */
import vogels from 'vogels';
import Promise from 'bluebird'

Promise.promisifyAll(require('vogels/lib/table').prototype);
Promise.promisifyAll(require('vogels/lib/item').prototype);
Promise.promisifyAll(require('vogels/lib/query').prototype);
Promise.promisifyAll(require('vogels/lib/scan').prototype);
Promise.promisifyAll(require('vogels/lib/parallelScan').prototype);

var vogels_model = vogels.model;
vogels.model = function(name, model){
  if (model) { Promise.promisifyAll(model); }
  return vogels_model.apply(vogels, arguments);
};

Promise.promisifyAll(vogels);

vogels.AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //logger: console
})

export default vogels
