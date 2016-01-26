const path = require('path');
const webpack = require('webpack');

module.exports = {
    cache: true,
    entry: {
        app: [
            './src/app.js'
        ]
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/assets/',
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
