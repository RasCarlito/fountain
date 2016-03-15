const path = require('path');
const helpers = require('yeoman-test');

exports.run = function run(prompts) {
  return new Promise(resolve => {
    const fountain = helpers.createGenerator('fountain-webapp:app', [
      path.join(__dirname, '../generator-fountain-webapp/generators/app')
    ], null);

    helpers.mockPrompt(fountain, prompts);

    helpers.testDirectory('work', () => fountain.run(resolve));
  });
};
