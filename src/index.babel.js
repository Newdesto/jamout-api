// only used in dev scripts
require('app-module-path').addPath(__dirname);
require('dotenv').config()
require('babel-register');
require('babel-polyfill');
require('./index');
