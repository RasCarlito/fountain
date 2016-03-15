const path = require('path');
const expect = require('chai').expect;
const Horseman = require('node-horseman');
const horseman = new Horseman({
  phantomPath: path.join(require.resolve('phantomjs'), '../../bin/phantomjs')
});

horseman
  .on('consoleMessage', console.log)
  // .on('resourceRequested', console.log)
  // .on('resourceReceived', console.log)
  // .on('navigationRequested', console.log)
  // .on('urlChanged', console.log)
  .open('http://localhost:3000/')
  .wait(2000)
  .count('h3')
  .then(result => {
    expect(result).to.equal(8);
  })
  .finally(() => {
    return horseman.close();
  });
