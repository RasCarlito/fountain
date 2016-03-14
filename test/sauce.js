var sauceConnectLauncher = require('sauce-connect-launcher');
var webdriverio = require('webdriverio');

var wdioOptions = {
  user: 'Swiip',
  key: 'key',
  logLevel: 'debug',
  desiredCapabilities: {
    browserName: 'chrome'
  }
};

var sclOptions = {
  username: 'Swiip',
  accessKey: 'key',
  verbose: true
}

var client = webdriverio.remote(options);

sauceConnectLauncher(sclOptions, function (err, sauceConnectProcess) {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log("Sauce Connect ready");

  client
    .init()
    .url('http://192.168.1.50:3000')
    .getTitle().then(function(title) {
        console.log('Title is: ' + title);
    })
    .end()
    .then(function() {
      sauceConnectProcess.close(function () {
        console.log("Closed Sauce Connect process");
      })
    });
});
