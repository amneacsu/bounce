/*eslint-disable */

var path = require('path');
var webpack = require('webpack');

// Get base config
var config = require('./base.config');

// Set source map type
config.devtool = 'source-map';

// Set output
config.output = {
  path: path.resolve('./dist/assets'),
  publicPath: './assets',
  filename: 'bundle.js'
};

// Add JavaScript loaders
config.module.loaders.push({
  test: /\.jsx?$/,
  exclude: /node_modules/,
  loaders: ['babel']
});

// Add uglify plugin
config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));

module.exports = config;
