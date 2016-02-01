/*eslint-disable */

var path = require('path');
var webpack = require('webpack');

// Get base config
var config = require('./base.config');

// Set source map type
config.devtool = 'eval-source-map';

// Set output
config.output = {
  path: path.resolve('./dist'),
  publicPath: '/',
  filename: 'bundle.js'
};

// Add webpack-dev-server options
config.devServer = {
  publicPath: '/',
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  port: 8070,
  host: '0.0.0.0',
  hot: true,
  historyApiFallback: true,
  contentBase: path.resolve(__dirname, '../dist')
};

// Add HMR
config.plugins.push(new webpack.HotModuleReplacementPlugin());

// Add JavaScript loaders
config.module.loaders.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loaders: ['babel']
});

module.exports = config;
