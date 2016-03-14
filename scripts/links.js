'use strict';

const path = require('path');
const spawn = require('cross-spawn');
const co = require('co');
const fountainDeps = require('./deps');

const deps = fountainDeps();

const exec = function (command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {cwd, stdio: 'inherit'});
    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(code);
      }
    });
  });
};

co(function *() {
  try {
    for (const dep of deps) {
      const folder = path.join(__dirname, '..', dep.name);
      console.log(folder, '➜', 'npm link');
      yield exec('npm', ['link'], folder);
      for (const sub of dep.deps) {
        console.log(folder, '➜', `npm link ${sub}`);
        yield exec('npm', ['link', sub], folder);
      }
    }
  } catch (e) {
    console.error('arg', e.stack);
  }
});
