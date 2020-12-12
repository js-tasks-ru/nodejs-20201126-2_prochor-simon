const fs = require('fs');
const url = require('url');
const http = require('http');
const path = require('path');

const server = new http.Server();

class CustomError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isValidFilePath = /[^\.]+\.[^\.]+/.test(pathname);
  const filepath = path.join(__dirname, 'files', pathname);

  try {
    if(!isValidFilePath) {
      throw new CustomError(400, 'Invalid file name');
    }
    if (!fs.existsSync(filepath)) {
      throw new CustomError(404, 'File not found');
    }

    switch (req.method) {
      case 'DELETE':
        fs.unlinkSync(filepath);
        break;
      default:
        throw new CustomError(501, 'Not implemented');
    }

    res.statusCode = 200;
    res.end('File deleted');
  } catch(error) {
    res.statusCode = error.code || 500;
    res.end(error.message);
  }
});

module.exports = server;
