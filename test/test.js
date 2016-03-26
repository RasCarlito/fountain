process.env.DEBUG = 'horseman';

const path = require('path');
const product = require('cartesian-product');
const serve = require('../scripts/serve');
const helper = require('../scripts/yeoman-helper');
const expect = require('chai').expect;
const Horseman = require('node-horseman');
const horseman = new Horseman({
  phantomPath: path.join(require.resolve('phantomjs'), '../../bin/phantomjs')
});

function horseTest() {
  const serveObj = serve();

  return serveObj.promise.then(url => {
    return horseman
      .on('consoleMessage', message => {
        console.log('[PhantomJS console]', message);
      })
      .open(url)
      .count('h3')
      .then(result => {
        expect(result).to.equal(8);
      })
      .finally(() => {
        serveObj.process.kill('SIGTERM');
      });
  });
}

describe('fountain integration test', function () {
  this.timeout(0);

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

    it(`should work with ${options.framework}, ${options.modules}, ${options.js}`, () => {
      return helper.run(options).then(horseTest);
    });

    after(horseman.close);
  });
});
