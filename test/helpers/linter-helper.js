'use strict';

const expect = require('chai').expect;
const path = require('path');
const globby = require('globby');
const fs = require('mz/fs');
const CLIEngine = require('eslint').CLIEngine;
const cli = new CLIEngine({});
const Linter = require('tslint');
const workPath = path.join(__dirname, '../../test/work');

exports.linterTest = function *(options) {
  exports.eslint();
  if (options.js === 'typescript') {
    yield exports.tslint(options.framework);
  }
};

exports.eslint = () => {
  const sources = [`${workPath}/conf/**/*.js`, `${workPath}/gulp_tasks/**/*.js`, `${workPath}/src/**/*.js`];
  const report = cli.executeOnFiles(sources);
  try {
    expect(report.errorCount).to.equal(0);
  } catch (error) {
    console.log(error);
  }
};

exports.tslint = function *(framework) {
  const extension = framework === 'react' ? 'tsx' : 'ts';
  const paths = yield globby([`${workPath}/src/**/*.${extension}`]);
  const configuration = {
    rules: {
    }
  };

  const options = {
    formatter: 'json',
    configuration
  };
  let failureCount = 0;
  for (const path of paths) {
    const contents = yield fs.readFile(path, 'utf8');

    const ll = new Linter(path, contents, options);
    const result = ll.lint();
    console.log(result);
    failureCount += result.failureCount;
  }
  expect(failureCount).to.equal(0);
};
