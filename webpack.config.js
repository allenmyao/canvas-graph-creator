const path = require('path');

module.exports = {
  cache: true,
  entry: {
    app: [
      'babel-polyfill',
      './src/js/app.js'
    ]
  },
  resolve: {
    root: path.resolve('src', 'js'),
    modulesDirectories: [ 'node_modules' ],
    extensions: [ '', '.js' ]
  },
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    publicPath: '/dist/js/',
    filename: '[name].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: []
};
