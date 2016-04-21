const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig, {
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style',
          'css!sass'
        )
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('../css/[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
});
