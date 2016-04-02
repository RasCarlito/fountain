const assert = require('assert');
const Horseman = require('node-horseman');
const horseman = new Horseman();

describe('Techs', () => {
  it('should retrieve 8 div with selector \'.tech\'', done => {
    horseman
      .open('http://localhost:1234/')
      .count('.tech')
      .then(result => {
        assert.equal(result, 8);
      })
      .finally(() => {
        done();
        return horseman.close();
      });
  });
});

describe('Hello', () => {
  it('should check if \'Hello World !\'', done => {
    horseman
      .open('http://localhost:3002/')
      .text('h1')
      .then(result => {
        assert.equal(result, 'Hello World!');
      })
      .finally(() => {
        done();
        return horseman.close();
      });
  });
});