const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');
const devServerConfig = require('./dev-server.config');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = [
    'webpack-dev-server/client?http://' + devServerConfig.SERVER_HOST + ':' + devServerConfig.SERVER_PORT,
    'webpack/hot/dev-server'
  ].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig, {
  debug: true,
  devtool: '#eval-source-map',
  module: {
    loaders: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        loaders: [ 'style', 'css', 'sass' ]
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    })
  ]
});
