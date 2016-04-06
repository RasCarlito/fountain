'use strict';

require('co-mocha');

const gulp = require('./helpers/gulp-helper');
const yeoman = require('./helpers/yeoman-helper');
const wdio = require('./helpers/wdio-helper');
const sauce = require('./helpers/saucelabs-helper');

describe('fountain interactive integration test with saucelabs and webdriver.io', function () {
  this.timeout(0);

  before(function *() {
    yield yeoman.prepare();
  });

  it(`should work with interactive options`, function *() {
    yield yeoman.run();
    yield sauce.connect();
    yield wdio.init();
    const url = yield gulp.serve();
    yield wdio.techsTest(url);
  });

  after(function *() {
    gulp.killServe();
    yield wdio.close();
    yield sauce.close();
  });
});
