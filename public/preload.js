const http = require('http');
const https = require('https');

const API_BASE_URL = 'http://127.0.0.1:5555';

function httpGet(url) {
  const fullUrl = url.startsWith('/api') ? API_BASE_URL + url : url;
  const client = fullUrl.startsWith('https') ? https : http;

  return new Promise(function (resolve, reject) {
    client
      .get(fullUrl, function (res) {
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
  const fullUrl = url.startsWith('/api') ? API_BASE_URL + url : url;
  const urlObj = new URL(fullUrl);
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
