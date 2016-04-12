const fs = require('fs');

fs.mkdirSync('temp');
fs.readdirSync('./').forEach(file => {
  if (file.includes('generator')) {
    fs.mkdirSync(`./temp/${file}`);
    fs.renameSync(`./${file}/node_modules`, `./temp/${file}/node_modules`);
  }
});
