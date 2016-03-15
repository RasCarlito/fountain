'use strict';

const path = require('path');
const co = require('co');
const fountainDeps = require('./deps');
const exec = require('./exec');

const deps = fountainDeps();

co(function *() {
  try {
    for (const dep of deps) {
      const folder = path.join(__dirname, '..', dep.name);
      console.log(folder, '➜', 'npm link');
      yield exec('npm', ['link'], {cwd: folder}).promise;
      for (const sub of dep.deps) {
        console.log(folder, '➜', `npm link ${sub}`);
        yield exec('npm', ['link', sub], {cwd: folder}).promise;
      }
    }
  } catch (e) {
    console.error('arg', e.stack);
  }
});
