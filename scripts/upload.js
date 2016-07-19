const fs = require('fs');
const path = require('path');
const co = require('co');
const fetch = require('node-fetch');
const FormData = require('form-data');

const combinations = require('./helpers/combinations');

try {
  co(function *() {
    for (const options of combinations.full()) {
      const fileName = `${options.framework}-${options.modules}-${options.js}-${options.css}-${options.router}-${options.sample}.zip`;
      const combinationPath = path.join(__dirname, `../dist/${fileName}`);

      const form = new FormData();
      form.append('name', fileName);
      form.append(fileName, fs.createReadStream(combinationPath), {
        headers: {
          'Authorization': process.env.GITHUB_TOKEN,
          'Content-Type': 'application/zip'
        }
      });

      const url = `https://github.com/repos/FountainJS/fountain/releases/${process.env.TRAVIS_TAG}/assets`;

      console.log('Uploading', fileName, 'to', url);

      yield fetch(url, {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      }).catch(console.error);
    }
  });
} catch (error) {
  console.log('Something went wrong', error);
}
