# Canvas Graph Creator
[![Build Status](https://travis-ci.org/allenmyao/canvas-graph-creator.svg?branch=master)](https://travis-ci.org/allenmyao/canvas-graph-creator) [![Test Coverage](https://codeclimate.com/github/allenmyao/canvas-graph-creator/badges/coverage.svg)](https://codeclimate.com/github/allenmyao/canvas-graph-creator/coverage) [![Issue Count](https://codeclimate.com/github/allenmyao/canvas-graph-creator/badges/issue_count.svg)](https://codeclimate.com/github/allenmyao/canvas-graph-creator)

> Graph creator using HTML5 canvas

## Building

Make sure you have Node installed.

To build the code, run the following:
```bash
# Install dependencies
npm install

# Build project to ./dist
npm run build
```

If you prefer using Gulp, run the following commands instead of `npm run build`:
``` bash
# Install Gulp globally (required for Gulp to work)
npm install -g gulp

# Build project to ./dist
gulp build
```

## Testing

Unit tests are written with Mocha (test framework) + Chai (assertion library). Unit tests can be run using the following command:
``` bash
# Run unit tests
gulp test
```

Browser tests use the Selenium framework (requires Maven). In order for these tests to work, the app must be hosted on a server. Run the following commands:
``` bash
# Before running browser tests, host the app
# Example:
npm install -g http-server
http-server ./dist --silent -p 8080 -a 0.0.0.0 &
# kill the server afterwards: fuser -k 8080/tcp

# Go to selenium test directory
cd selenium-tests/

# Run browser tests
mvn test
```

## Development

A development server is provided with ESLint and [Hot Module Replacement (HMR)](https://webpack.github.io/docs/hot-module-replacement.html). HMR enables live reloading of modules as changes are made to the files.

To run the development server, run `npm run dev` or `gulp`. Navigate to `http://localhost:8080/webpack-dev-server/index.html` to view the app.
