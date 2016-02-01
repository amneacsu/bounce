/*eslint-disable */

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, '..'),

  entry: [
    './src/scripts/index.js'
  ],

  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      filename: '../index.html',
      inject: 'body'
    })
  ],

  module: {
    loaders: [

    ]
  },

  resolve: {
    alias: {
      app: path.resolve('src/scripts/app')
    },
    modulesDirectories: [
      'node_modules'
    ],
    extensions: ['', '.js', '.jsx']
  }
};
