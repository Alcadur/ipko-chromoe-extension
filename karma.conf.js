// Karma configuration
// Generated on Sat Aug 22 2020 20:13:37 GMT+0200 (Central European Summer Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['sinon-chrome', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'tests-setup/tests-helpers.js',
      'tests-setup/test-init-script.js',
      'src/shared/provider-generator.js',
      'src/shared/tab-utils.js',
      'src/shared/message-action.type.js',
      'src/shared/message.service.js',
      'src/shared/query.js',
      'src/shared/wait.js',
      'src/shared/store.js',
      'src/shared/input.service.js',
      'src/shared/id-generator.js',
      'src/shared/outer-promise.js',
      'src/shared/template-helper.js',
      'src/shared/dialog.service.js',

      'src/shared/*.spec.js',
      'src/content/**/*.js',

      { pattern: 'src/popup/message-actions/*.js', type: 'module' },
      { pattern: 'src/options/options-url*.js', type: 'module' },
      { pattern: 'src/options/view-manager*.js', type: 'module' },
      { pattern: 'src/options/views/recipients/shared/**/*.js', type: 'module' },
      { pattern: 'src/options/views/recipients/edit/*.controller*.js', type: 'module' },
      { pattern: 'src/options/views/recipients/add/*.controller*.js', type: 'module' },
      { pattern: 'src/options/views/dashboard/*.controller*.js', type: 'module' },
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  })
}
