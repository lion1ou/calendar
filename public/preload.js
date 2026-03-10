const http = require('http');
const https = require('https');

function httpGet(url) {
  const client = url.startsWith('https') ? https : http;

  return new Promise(function (resolve, reject) {
    client
      .get(url, function (res) {
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          rawData += chunk;
        });
        res.on('end', function () {
          try {
            resolve({ data: JSON.parse(rawData) });
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function httpPost(url, data) {
  const urlObj = new URL(url);
  const client = urlObj.protocol === 'https:' ? https : http;
  const postData = JSON.stringify(data);

  return new Promise(function (resolve, reject) {
    const req = client.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      function (res) {
        let rawData = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
          rawData += chunk;
        });
        res.on('end', function () {
          try {
            resolve({ data: JSON.parse(rawData) });
          } catch (e) {
            reject(e);
          }
        });
      },
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

window.utoolsApi = { get: httpGet, post: httpPost };
