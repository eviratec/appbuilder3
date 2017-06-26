"use strict";

module.exports = function (config) {
  config.set({
    basePath: "./",
    frameworks: ["jasmine"],
    client: {
      jasmine: {
        spec_files: [
          // "test/spec/*/**/*spec.js",
        ],
      },
    },
    //browsers: ["Chrome"],
    browsers: ["PhantomJS"],
    files: [
      {pattern: 'test/*/**/*/data/*.json', watched: true, included: false, served: true, nocache: true},
      "bower_components/angular/angular.js",
      "bower_components/angular-aria/angular-aria.js",
      "bower_components/angular-animate/angular-animate.js",
      "bower_components/angular-cookies/angular-cookies.js",
      "bower_components/angular-material/angular-material.js",
      "bower_components/angular-mocks/angular-mocks.js",
      "src/appbuilder3.js",
      "src/**/*.js",
      "test/helpers/readJson.fn.js",
      "test/spec/*/**/*.fn.js",
      "test/spec/*/**/*spec.js",
      // "test/spec/*/**/*.js",
    ],
  });
};
