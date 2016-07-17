const fs = require('fs');
const archiver = require('archiver');

exports.zipFolder = function zipFolder(source, destination) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(destination);
    const archive = archiver('zip');

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);

    archive.bulk([
      {expand: true, cwd: source, src: ['**'], dot: true}
    ]);

    archive.finalize();
  });
};
