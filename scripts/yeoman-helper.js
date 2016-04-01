const path = require('path');
const co = require('co');
const helpers = require('yeoman-test');
const Promise = require('bluebird');
const mkdirpCb = require('mkdirp');
const fs = require('mz/fs');

const generatorPath = path.join(__dirname, '../generator-fountain-webapp/generators/app');
const workPath = path.join(__dirname, '../test/work');
const depsPath = path.join(__dirname, '../test/deps');
const packageFolders = ['node_modules', 'jspm_packages', 'bower_components', 'typings'];

const mkdirp = Promise.promisify(mkdirpCb);
const testDirectory = Promise.promisify(helpers.testDirectory);

exports.run = function run(prompts) {
  const fountain = helpers.createGenerator('fountain-webapp:app', [generatorPath], null);
  const run = Promise.promisify(fountain.run.bind(fountain));

  helpers.mockPrompt(fountain, prompts);

  return co(function *() {
    yield testDirectory(workPath);
    yield mkdirp(depsPath);
    yield packageFolders.map(
      folder => mkdirp(path.join(depsPath, folder))
    );
    yield packageFolders.map(
      folder => fs.symlink(path.join(depsPath, folder), path.join(workPath, folder))
    );
    return yield run();
  });
};
