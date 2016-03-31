# Canvas Graphs Creator
[![Build Status](https://travis-ci.org/allenmyao/canvas-graph-creator.svg?branch=master)](https://travis-ci.org/allenmyao/canvas-graph-creator) [![Test Coverage](https://codeclimate.com/github/allenmyao/canvas-graph-creator/badges/coverage.svg)](https://codeclimate.com/github/allenmyao/canvas-graph-creator/coverage) [![Issue Count](https://codeclimate.com/github/allenmyao/canvas-graph-creator/badges/issue_count.svg)](https://codeclimate.com/github/allenmyao/canvas-graph-creator)

## Building

Make sure you have Node installed.

To build the code, run the following:
```bash
# Install dependencies
npm install
# Compile code to ./dist/js/app.js
gulp build
```

## Development

To run the Webpack Dev Server, simply run `gulp`. Browse to `http://localhost:8080/webpack-dev-server/index.html` to view the live app.

Alternatively, you can run `gulp build-dev` to watch/rebuild using Gulp/Webpack.
