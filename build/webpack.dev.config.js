const webpack = require('webpack');
const merge = require('webpack-merge');

const baseWebpackConfig = require('./webpack.base.config');
const devServerConfig = require('./dev-server.config');

module.exports = merge(baseWebpackConfig, {
  debug: true,
  devtool: '#eval-source-map',
  entry: {
    app: [
      'webpack-dev-server/client?http://' + devServerConfig.SERVER_HOST + ':' + devServerConfig.SERVER_PORT,
      'webpack/hot/dev-server',
      'babel-polyfill',
      './src/js/app.js'
    ]
  },
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
    new webpack.HotModuleReplacementPlugin()
  ]
});
