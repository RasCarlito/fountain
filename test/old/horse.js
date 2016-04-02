const path = require('path');
const expect = require('chai').expect;

process.env.DEBUG = 'horseman';
const Horseman = require('node-horseman');
const horseman = new Horseman({
  phantomPath: path.join(require.resolve('phantomjs'), '../../bin/phantomjs')
});

horseman
  .on('consoleMessage', console.log)
  .open('http://localhost:3000/')
  // .wait(2000)
  .count('h3')
  .then(result => {
    console.log('result', result);
    expect(result).to.equal(8);
  })
  .finally(() => {
    return horseman.close();
  });
