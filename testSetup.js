// If the node environment isn't CircleCI we assume that an env file exists.
// Production bypasses env config loading.
if (process.env.NODE_ENV !== 'test') {
  require('dotenv').config()
}
require('app-module-path').addPath(__dirname + '/src')
require('babel-register')
require('babel-polyfill')
