var path = require('path');
var webpack = require('webpack')
var nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    '/gql/index': './gql/index',
    '/soundcloud/trackMetadata': './soundcloud/trackMetadata',
    '/soundcloud/trackFiles': './soundcloud/trackFiles',
    '/music/triggerReleaseReadinessChecker': './music/triggerReleaseReadinessChecker',
    '/music/metadataCheck': './music/metadataCheck',
    '/music/objectCheck': './music/objectCheck',
    '/music/objectCopy': './music/objectCopy',
  },
  devtool: "source-map",
  target: 'node',
  externals: [nodeExternals()],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      include: __dirname,
      exclude: /node_modules/,
    }]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  }
}