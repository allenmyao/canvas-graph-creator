const path = require('path');

const config = require('../config');
const projectRoot = path.resolve(__dirname, '../');

module.exports = {
  cache: true,
  entry: {
    app: [
      'babel-polyfill',
      './src/js/app.js'
    ]
  },
  resolve: {
    extensions: [ '', '.js', '.ts' ],
    fallback: [ path.join(__dirname, '../node_modules') ],
    alias: {
      src: path.resolve(__dirname, '../src')
    }
  },
  resolveLoader: {
    fallback: [ path.join(__dirname, '../node_modules') ]
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: projectRoot,
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  eslint: {
    formatter: require('eslint-friendly-formatter')
  },
  plugins: []
};
