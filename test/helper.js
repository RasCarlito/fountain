const path = require('path');
const helpers = require('yeoman-test');
const spawn = require('cross-spawn');

exports.run = function run(prompts, callback) {
  process.chdir(__dirname);

  const fountain = helpers.createGenerator('fountain-webapp:app', [
    path.join(__dirname, '../generator-fountain-webapp/generators/app')
  ], null);

  helpers.mockPrompt(fountain, prompts);

  helpers.testDirectory('work', function() {
    fountain.run(function() {
      const test = spawn('gulp', ['test'], { stdio: 'inherit' });
      test.on('exit', function(returnCode) {
        callback(returnCode);
      });
    });
  });
};
