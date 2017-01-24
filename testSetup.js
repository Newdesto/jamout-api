// We wrap .env loading in a try/catch because some environments, like
// CircleCI don't use a .env file - instead they define it on the system level.
// Production avoids this file entirely.
try {
  require('dotenv').config()
} catch (e) {
  // Catch and surpress.
  console.error(e)
}
require('app-module-path').addPath(__dirname + '/src')
require('babel-register')
require('babel-polyfill')
