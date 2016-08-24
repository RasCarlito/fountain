'use strict';

require('co-mocha');
const product = require('cartesian-product');
const gulp = require('./helpers/gulp-helper');
const yeoman = require('./helpers/yeoman-helper');
// const wdio = require('./helpers/wdio-helper');
// const sauce = require('./helpers/saucelabs-helper');
const linter = require('./helpers/linter-helper');
const unit = require('./helpers/unit-helper');
const jsdom = require('./helpers/jsdom-helper');

describe('fountain travis integration test with saucelabs and webdriver.io', function () {
  this.timeout(0);

  before(function *() {
    // yield sauce.connect();
    // yield wdio.init();
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
      sample: 'techs',
      router: combination[0] === 'angular1' ? 'uirouter' : 'router',
      ci: 'travis'
    };

    describe(`tests with ${options.framework}, ${options.modules}, ${options.js}`, () => {
      before(function *() {
        yield yeoman.prepare();
        yield yeoman.run(options);
      });

      it('should test linter', function *() {
        yield linter.linterTest(options);
      });

      it('should run "gulp test"', function *() {
        const result = yield gulp.test();
        unit.unitTests(result);
      });

      it('should run "gulp serve" and e2e on number of Techs listed', function *() {
        const url = yield gulp.serve();
        // yield wdio.techsTest(url);
        // yield new Promise(resolve => {
        //   jsdom.env(url, [], (err, window) => {
        //     console.log('inside jsdom');
        //     // console.log('err', err);
        //     // console.log('window', window);
        //     console.log(window.document.querySelectorAll('h3'));
        //     expect(window.document.querySelectorAll('h3').to.equal(8));
        //     resolve();
        //   });
        // });
        yield jsdom.open(url).then(window => jsdom.testTechs(window));
        gulp.killServe();
      });

      // it('should run "gulp serve:dist" and e2e on number of Techs listed', function *() {
      //   const url = yield gulp.serveDist();
      //   yield wdio.techsTest(url);
      //   gulp.killServe();
      // });
    });
  });

  after(function *() {
    // yield wdio.close();
    // yield sauce.close();
  });
});
