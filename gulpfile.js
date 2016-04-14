const gulp = require('gulp');
const gutil = require('gulp-util');
const del = require('del');
const mergeStream = require('merge-stream');

const eslint = require('gulp-eslint');
const esdoc = require('gulp-esdoc');

const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-babel-istanbul');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackDevConfig = require('./build/webpack.dev.config');
const webpackProdConfig = require('./build/webpack.prod.config');
const devServerConfig = require('./build/dev-server.config');

const COVERAGE_THRESHOLD = 90; // percentage
const SRC_FILES = 'src/js/**/*.js';
const TEST_FILES = 'test/**/*.js';
// const BROWSER_TEST_FILES = '';
const BUILD_OUTPUT_DIR = 'dist';
const DOCS_OUTPUT_DIR = 'esdoc';

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
            reporter: 'min'
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
  return del([ BUILD_OUTPUT_DIR ]);
});

gulp.task('prep', [ 'clean' ]);

gulp.task('webpack:build', [ 'prep' ], (callback) => {
  // run webpack
  webpack(webpackProdConfig, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack:build', err);
    }
    gutil.log('[webpack:build]', stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('webpack-dev-server', [ 'prep' ], (callback) => {
  var compiler = webpack(webpackDevConfig);

  compiler.plugin('done', () => {
    gutil.log('[webpack-dev-server]', 'Webpack: Build successful!');
  });

  var devServer = new WebpackDevServer(compiler, {
    hot: true,
    quiet: false,
    noInfo: true,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    publicPath: webpackDevConfig.output.publicPath,
    stats: {
      colors: true
    }
  });

  devServer.listen(devServerConfig.SERVER_PORT, devServerConfig.SERVER_HOST, (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    gutil.log('[webpack-dev-server]', 'http://' + devServerConfig.SERVER_HOST + ':' + devServerConfig.SERVER_PORT + '/webpack-dev-server/index.html');
  });
});
