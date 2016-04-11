'use strict';

require('co-mocha');
const product = require('cartesian-product');

const gulp = require('./helpers/gulp-helper');
const yeoman = require('./helpers/yeoman-helper');
const wdio = require('./helpers/wdio-helper');
const sauce = require('./helpers/saucelabs-helper');
const linter = require('./helpers/linter-helper');

describe('fountain travis integration test with saucelabs and webdriver.io', function () {
  this.timeout(0);

  before(function *() {
    yield sauce.connect();
    yield wdio.init();
    yield yeoman.prepare();
  });

  const combinations = product([
    ['react', 'angular1', 'angular2'],
    ['webpack', 'systemjs', 'inject'],
    ['babel', 'js', 'typescript']
  ])
    // Angular 2 and Bower are not supported right now
    .filter(combination => combination[0] !== 'angular2' || combination[1] !== 'inject');

  combinations.forEach(combination => {
    const options = {
      framework: combination[0],
      modules: combination[1],
      css: 'scss',
      js: combination[2],
      sample: 'techs'
    };

    it(`should test linter on ${options.framework}, ${options.modules}, ${options.js}`, function *() {
      yield yeoman.run(options);
      yield linter.linterTest(options);
    });

    it(`should work with ${options.framework}, ${options.modules}, ${options.js}`, function *() {
      console.log(`Running test with ${options.framework}, ${options.modules}, ${options.js}`);
      yield yeoman.run(options);
      const url = yield gulp.serve();
      yield wdio.techsTest(url);
      console.log('End of test');
      gulp.killServe();
      console.log('Server killed');
    });
  });

  after(function *() {
    yield wdio.close();
    yield sauce.close();
  });
});
