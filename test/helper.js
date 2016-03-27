const path = require('path');
const helpers = require('yeoman-test');
const spawn = require('cross-spawn');

const generatorPath = path.join(__dirname, '../generator-fountain-webapp/generators/app');
const workPath = path.join(__dirname, 'work');

exports.run = function run(prompts, callback) {
  const fountain = helpers.createGenerator('fountain-webapp:app', [generatorPath], null);

  helpers.mockPrompt(fountain, prompts);

  helpers.testDirectory(workPath, () => {
    fountain.run(() => {
      const test = spawn('gulp', ['test'], {stdio: 'inherit'});
      test.on('exit', callback);
    });
  });
};
