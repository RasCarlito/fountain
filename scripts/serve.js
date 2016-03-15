'use strict';

const exec = require('./exec');
const spy = require('through2-spy');
const regex = /\[BS\] Access URLs:\n -*\n *Local: ([^\s]*)/;

module.exports = function serve() {
  let logs = '';
  let serve = null;

  const promise = new Promise(resolve => {
    serve = exec('gulp', ['serve'], {stdio: 'pipe'}).process;
    serve.stderr.pipe(process.stderr);
    serve.stdout.pipe(spy(chunk => {
      logs += chunk.toString();
      const result = regex.exec(logs);
      if (result !== null) {
        resolve(result[1]);
      }
    })).pipe(process.stdout);
  });

  return {process: serve, promise};
};
