const path = require('path');
const product = require('cartesian-product');
const exec = require('../scripts/exec');
const helper = require('../scripts/yeoman-helper');
const expect = require('chai').expect;
const Horseman = require('node-horseman');
const horseman = new Horseman({
  phantomPath: path.join(require.resolve('phantomjs'), '../../bin/phantomjs')
});

function horseTest() {
  return new Promise(resolve => {
    const serve = exec('gulp', ['serve']).process;
    setTimeout(() => {
      horseman
        .open('http://localhost:3000/')
        .count('h3')
        .then(result => {
          expect(result).to.equal(8);
        })
        .finally(() => {
          serve.kill('SIGTERM');
          resolve();
        });
    }, 10000);
  });
}

describe('fountain integration test', function () {
  this.timeout(0);

  const combinations = product([
    ['react', 'angular1', 'angular2'],
    ['webpack', 'systemjs', 'inject'],
    ['babel', 'js', 'typescript']
  ]);

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
