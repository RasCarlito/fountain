const fs = require('fs');
const path = require('path');
const co = require('co');
const fetch = require('node-fetch');

const combinations = require('./helpers/combinations');

const githubApiUrl = 'https://api.github.com/repos/FountainJS/fountain';
const githubUploadUrl = 'https://uploads.github.com/repos/FountainJS/fountain';

function githubRequest(rootUrl, partialUrl, params) {
  if (!params.headers) {
    params.headers = {};
  }
  params.headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;

  console.log(params.method, partialUrl);

  return fetch(`${rootUrl}${partialUrl}`, params)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }
      return response.text();
    })
    .then(response => {
      console.log(response);
      return response;
    })
    .catch(console.error);
}

function githubApiRequest(partialUrl, params) {
  return githubRequest(githubApiUrl, partialUrl, params);
}

function githubUploadRequest(partialUrl, params) {
  return githubRequest(githubUploadUrl, partialUrl, params);
}

try {
  co(function *() {
    yield githubApiRequest('/releases', {
      method: 'POST',
      body: JSON.stringify({tag_name: process.env.TRAVIS_TAG}) // eslint-disable-line camelcase
    });

    const tag = yield githubApiRequest(`/releases/tags/${process.env.TRAVIS_TAG}`, {
      method: 'GET'
    });

    for (const options of combinations.full()) {
      const fileName = `${options.framework}-${options.modules}-${options.js}-${options.css}-${options.router}-${options.sample}.zip`;
      const combinationPath = path.join(__dirname, `../dist/${fileName}`);

      const body = fs.readFileSync(combinationPath);

      yield githubUploadRequest(`/releases/${tag.id}/assets?name=${fileName}`, {
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/zip',
          'Content-Length': body.length
        }
      });
    }
  });
} catch (error) {
  console.log('Something went wrong', error);
}
