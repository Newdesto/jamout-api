// We wrap .env loading in a try/catch because some environments, like
// CircleCI don't use a .env file - instead they define it on the system level.
// Production avoids this file entirely.
try {
  /* eslint-disable global-require */
  require('dotenv').config()
} catch (err) {
  // Catch and surpress.
  console.error(err)
}
const path = require('path')
require('app-module-path').addPath(path.resolve(`${__dirname}/src`))
require('babel-register')
require('babel-polyfill')
