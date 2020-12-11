const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const MAX_SIZE = 1e6;
const EMPTY_FN = () => {};

function receiveFile(filepath, req, res) {
  if (req.headers['content-length'] > MAX_SIZE) {
    res.statusCode = 413;
    res.end('File is too big!');
    return;
  }

  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
  const limitStream = new LimitSizeStream({limit: MAX_SIZE});

  req.pipe(limitStream).pipe(writeStream);

  limitStream.on('error', (err) => {
    if (err.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.setHeader('Connection', 'close');
      res.end('File is too big');
    } else {
      res.statusCode = 500;
      res.setHeader('Connection', 'close');
      res.end('Internal server error');
    }

    fs.unlink(filepath, EMPTY_FN);
  });

  writeStream.on('error', err => {
    if (err.code === 'EEXIST') {
      res.statusCode = 409;
      res.end('File exists');
    } else {
      res.statusCode = 500;
      res.setHeader('Connection', 'close');
      res.end('Internal server error');
      fs.unlink(filepath, EMPTY_FN);
    }
  });

  writeStream.on('close', () => {
    res.statusCode = 201;
    res.end('File created');
  });

  res.on('close', () => {
    if (!res.finished) {
      fs.unlink(filepath, () => {});
    }
  });
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isValidFilePath = /[^\.]+\.[^\.]+/.test(pathname);
  const filepath = path.join(__dirname, 'files', pathname);

  if(!isValidFilePath) {
    res.statusCode = 400;
    res.end('Invalid file name');
    return;
  }

  if (!filepath) {
    res.statusCode = 404;
    res.end('File not found');
    return;
  }

  switch (req.method) {
    case 'POST':
      receiveFile(filepath, req, res);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
