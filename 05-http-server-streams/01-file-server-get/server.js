const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const server = new http.Server();

function sendFile(filepath, res) {
  const fileStream = fs.createReadStream(filepath);
  fileStream.pipe(res);

  fileStream
      .on('error', err => {
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          res.end('Not found');
        } else {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
      });

  res.on('close', () => {
    if (!res.finished) {
      fileStream.destroy();
    }
  });
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const isValidFilePath = /[^\.]+\.[^\.]+/.test(pathname);

  if(!isValidFilePath) {
    res.statusCode = 400;
    res.end('Invalid file name');
    return;
  }

  switch (req.method) {
    case 'GET':
      sendFile(filepath, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
