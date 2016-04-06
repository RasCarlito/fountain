'use strict';

const exec = require('../../scripts/exec');
const spy = require('through2-spy');
const regex = /\[BS\] Access URLs:\n -*\n.*\n *External: ([^\s]*)/;

let serveProcess = null;

exports.serve = function serve() {
  return new Promise(resolve => {
    let logs = '';
    if (serveProcess !== null) {
      console.warn('Server process still running !!!!');
    }
    serveProcess = exec('gulp', ['serve'], {stdio: 'pipe'}).process;
    serveProcess.stderr.pipe(process.stderr);
    serveProcess.stdout.pipe(spy(chunk => {
      logs += chunk.toString();
      const result = regex.exec(logs);
      if (result !== null) {
        resolve(result[1]);
      }
    })).pipe(process.stdout);
  });
};

exports.killServe = function killServe() {
  serveProcess.kill('SIGTERM');
  serveProcess = null;
};
