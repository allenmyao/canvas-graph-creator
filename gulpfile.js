const gulp = require('gulp');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('./webpack.config.js');

const istanbul = require('gulp-babel-istanbul');
const mocha = require('gulp-mocha');
const babel = require('gulp-babel');
const mergeStream = require('merge-stream');

const COVERAGE_THRESHOLD = 90; // percentage
const SRC_FILES = 'src/**/*.js';
const TEST_FILES = 'test/**/*.js';
const BROWSER_TEST_FILES = '';


gulp.task('test', ['lint'], (cb) => {
    mergeStream(
        gulp.src([SRC_FILES])
            .pipe(istanbul()),
        gulp.src([TEST_FILES])
            .pipe(babel())
    ).pipe(istanbul.hookRequire())
        .on('finish', () => {
            gulp.src([TEST_FILES])
                .pipe(mocha())
                .pipe(istanbul.writeReports({
                    dir: './coverage',
                    includeUntested: true,
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
                    // process.exit(1);
                })
                .on('end', cb);
        });
});

gulp.task('lint', () => {
    gulp.src(SRC_FILES)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.format('checkstyle', function (results) {
            require('fs').writeFileSync(require('path').join(__dirname, 'eslint-output.xml'), results);
        }))
        .pipe(eslint.results((results) => {
            // Called once for all ESLint results.
            console.log('Total Results: ' + results.length);
            console.log('Total Warnings: ' + results.warningCount);
            console.log('Total Errors: ' + results.errorCount);
        }));
        // .pipe(eslint.failAfterError());
});

gulp.task('prep', ['test']);

// Tasks below this line are based on the webpack-with-common-libs gulpfile:
// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
// A few modifications were made to enable HMR (Hot Module Replacement) and
// to make the dev server accessible from the host machine when run in a VM

// The development server (the recommended option for development)
gulp.task('default', ['webpack-dev-server']);

// Build and watch cycle (another option for development)
// Advantage: No server required, can run app from filesystem
// Disadvantage: Requests are not blocked until bundle is available,
//               can serve an old app on refresh
gulp.task('build-dev', ['webpack:build-dev'], () => {
    gulp.watch([SRC_FILES], ['webpack:build-dev']);
});

// Production build
gulp.task('build', ['webpack:build']);

gulp.task('webpack:build', ['prep'], (callback) => {
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            'process.env': {
                // This has effect on the react lib size
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, (err, stats) => {
        if (err) throw new gutil.PluginError('webpack:build', err);
        gutil.log('[webpack:build]', stats.toString({
            colors: true
        }));
        callback();
    });
});

// modify some webpack config options
var myDevConfig = Object.create(webpackConfig);
myDevConfig.devtool = 'sourcemap';
myDevConfig.debug = true;

// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);

gulp.task('webpack:build-dev', ['prep'], (callback) => {
    // run webpack
    devCompiler.run((err, stats) => {
        if (err) throw new gutil.PluginError('webpack:build-dev', err);
        gutil.log('[webpack:build-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
});

var serverHost = '0.0.0.0';

gulp.task('webpack-dev-server', ['prep'], (callback) => {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.debug = true;
    myConfig.devtool = 'eval';
    myConfig.entry.app.unshift('webpack-dev-server/client?http://' + serverHost + ':8080', 'webpack/hot/dev-server');
    myConfig.plugins = myConfig.plugins.concat(new webpack.HotModuleReplacementPlugin());

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
    }).listen(8080, serverHost, (err) => {
        if (err) throw new gutil.PluginError('webpack-dev-server', err);
        gutil.log('[webpack-dev-server]', 'http://' + serverHost + ':8080/webpack-dev-server/index.html');
    });
});
