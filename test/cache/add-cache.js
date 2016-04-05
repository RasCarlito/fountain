const fs = require('fs');

fs.readdirSync('./').forEach(file => {
  if (file.includes('generator')) {
    fs.renameSync(`./temp/${file}/node_modules`, `./${file}/node_modules`);
  }
});
