const path = require('path');
const helpers = require('yeoman-test');

const generatorPath = path.join(__dirname, '../generator-fountain-webapp/generators/app');
const workPath = path.join(__dirname, '../test/work');

exports.run = function run(prompts) {
  return new Promise(resolve => {
    const fountain = helpers.createGenerator('fountain-webapp:app', [generatorPath], null);

    helpers.mockPrompt(fountain, prompts);

    helpers.testDirectory(workPath, () => {
      fountain.fs.delete(`${workPath}/package.json`);
      fountain.run(resolve);
    });
  });
};
