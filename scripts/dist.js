'use strict';

const path = require('path');
const co = require('co');
const product = require('cartesian-product');
const helpers = require('yeoman-test');
const mkdirp = require('mkdirp-promise');
const rimraf = require('rimraf-promise');
const Promise = require('bluebird');

const output = require('./mute');

const generatorPath = path.join(__dirname, '../generator-fountain-webapp/generators/app');

try {
  co(function *() {
    try {
      yield rimraf(path.join(__dirname, `../dist`));

      const combinations = product([
        ['react', 'angular1', 'angular2'],
        ['webpack', 'systemjs', 'inject'],
        ['babel', 'js', 'typescript'],
        ['css', 'scss', 'less', 'styl'],
        ['hello', 'techs', 'todoMVC']
      ])
        // Angular 2 and Bower are not supported right now
        .filter(combination => combination[0] !== 'angular2' || combination[1] !== 'inject');

      for (const combination of combinations) {
        const options = {
          framework: combination[0],
          modules: combination[1],
          css: combination[3],
          js: combination[2],
          sample: combination[4],
          router: combination[0] === 'angular1' ? 'uirouter' : 'router'
        };
        const combinationPath = path.join(__dirname, `../dist/${options.framework}-${options.modules}-${options.js}-${options.css}-${options.router}-${options.sample}`);
        yield mkdirp(combinationPath);
        const fountain = helpers.createGenerator('fountain-webapp:app', [generatorPath], null, {
          'skipInstall': true,
          'skip-welcome-message': true
        });
        fountain.env.cwd = combinationPath;
        helpers.mockPrompt(fountain, options);
        const run = Promise.promisify(fountain.run.bind(fountain));
        output.mute();
        yield run();
        output.unmute();
        console.log('Generated', combinationPath);
      }
    } catch (error) {
      console.log('coucou 2', error);
    }
  });
} catch (error) {
  console.log('coucou', error);
}
