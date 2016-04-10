const gulp = require('gulp');
const gutil = require('gulp-util');
const del = require('del');
const eslint = require('gulp-eslint');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const esdoc = require('gulp-esdoc');

const webpackConfig = require('./webpack.config.js');

const istanbul = require('gulp-babel-istanbul');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const mergeStream = require('merge-stream');

const COVERAGE_THRESHOLD = 90; // percentage
const SRC_FILES = 'src/js/**/*.js';
const TEST_FILES = 'test/**/*.js';
// const BROWSER_TEST_FILES = '';
const OUTPUT_DIR = 'dist';
const DOCS_OUTPUT_DIR = 'esdoc';

const SERVER_HOST = '0.0.0.0';

// The development server (the recommended option for development)
gulp.task('default', [ 'webpack-dev-server' ]);

// Production build
gulp.task('build', [ 'webpack:build' ]);

gulp.task('clean:docs', () => {
  return del([ DOCS_OUTPUT_DIR ]);
});

gulp.task('docs', [ 'clean:docs' ], () => {
  return gulp.src(SRC_FILES)
    .pipe(esdoc());
});

gulp.task('lint', () => {
  return gulp.src([ SRC_FILES, TEST_FILES ])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.format('checkstyle', function (results) {
        require('fs').writeFileSync(require('path').join(__dirname, 'eslint-output.xml'), results);
      }))
      .pipe(eslint.results((results) => {
        // Called once for all ESLint results.
        gutil.log('[lint]', 'Total Results: ' + results.length);
        gutil.log('[lint]', 'Total Warnings: ' + results.warningCount);
        gutil.log('[lint]', 'Total Errors: ' + results.errorCount);
      }))
      // exit if linting error is encountered
      .pipe(eslint.failAfterError());
});

gulp.task('test', [ 'lint' ], (cb) => {
  mergeStream(
    gulp.src([ SRC_FILES ])
      .pipe(istanbul({
        includeUntested: true
      })),
    gulp.src([ TEST_FILES ])
      .pipe(babel())
  ).pipe(istanbul.hookRequire())
    .on('finish', () => {
      gulp.src([ TEST_FILES ])
          .pipe(mocha({
            reporter: 'nyan'
          }))
          .pipe(istanbul.writeReports({
            dir: './coverage',
            reporters: [ 'clover', 'lcov', 'text', 'text-summary' ],
            reportOpts: {
              clover: {
                dir: './coverage/tap',
                file: 'clover.tap'
              },
              lcov: {
                dir: './coverage/lcov',
                file: 'lcov.info'
              }
            }
          }))
          .pipe(istanbul.enforceThresholds({ thresholds: { global: COVERAGE_THRESHOLD } }))
          .on('error', (err) => {
            gutil.log('[test]', gutil.colors.red(`Coverage not meeting threshold of ${COVERAGE_THRESHOLD}%`));

            // exit if coverage threshold is not met
            // process.exit(1);
          })
          .on('end', cb);
    });
});

gulp.task('clean', [ 'test' ], () => {
  return del([ OUTPUT_DIR ]);
});

gulp.task('prep', [ 'clean' ]);

gulp.task('webpack:build', [ 'prep' ], (callback) => {
  var myConfig = Object.create(webpackConfig);
  myConfig.module.loaders = myConfig.module.loaders.concat({
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract(
      'style',
      'css!sass'
    )
  });
  myConfig.plugins = myConfig.plugins.concat(
    new ExtractTextPlugin('../css/[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin()
  );

  // run webpack
  webpack(myConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

// // modify some webpack config options
// var myDevConfig = Object.create(webpackConfig);
// myDevConfig.devtool = 'eval-source-map';
// myDevConfig.debug = true;
// myDevConfig.module.loaders = myDevConfig.module.loaders.concat({
//   test: /\.scss$/,
//   exclude: /node_modules/,
//   loaders: [ 'style', 'css', 'sass' ]
// });
//
// // create a single instance of the compiler to allow caching
// var devCompiler = webpack(myDevConfig);
//
// gulp.task('webpack:build-dev', [ 'prep' ], (callback) => {
//   // run webpack
//   devCompiler.run((err, stats) => {
//     if (err) {
//       throw new gutil.PluginError('webpack:build-dev', err);
//     }
//     gutil.log('[webpack:build-dev]', stats.toString({
//       colors: true
//     }));
//     callback();
//   });
// });

gulp.task('webpack-dev-server', [ 'prep' ], (callback) => {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.debug = true;
  myConfig.devtool = 'eval-source-map';
  myConfig.entry.app.unshift('webpack-dev-server/client?http://' + SERVER_HOST + ':8080', 'webpack/hot/dev-server');
  myConfig.plugins = myConfig.plugins.concat(new webpack.HotModuleReplacementPlugin());
  myConfig.module.loaders = myConfig.module.loaders.concat({
    test: /\.scss$/,
    exclude: /node_modules/,
    loaders: [ 'style', 'css', 'sass' ]
  });

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(myConfig), {
    hot: true,
    quiet: false,
    noInfo: true,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    publicPath: myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(8080, SERVER_HOST, (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://' + SERVER_HOST + ':8080/webpack-dev-server/index.html');
  });
});
