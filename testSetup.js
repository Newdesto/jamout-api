try {
  require('app-module-path').addPath(__dirname + '/src')
} catch (e) {
  console.error(e)
}
require('dotenv').config()
require('babel-register')
require('babel-polyfill')
