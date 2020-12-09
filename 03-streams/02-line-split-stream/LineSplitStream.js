const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.prevLines = '';
  }

  _transform(chunk, encoding, callback) {
    const str = this.prevLines + chunk.toString();
    const lines = str.split(os.EOL);
    const isLastLine = !str.endsWith(os.EOL);

    this.prevLines = isLastLine ? lines.pop() : '';

    lines.forEach(line => {
      this.push(line);
    });

    callback();
  }

  _flush(callback) {
    if (this.prevLines) {
      this.push(this.prevLines);
    }

    callback();
  }
}

module.exports = LineSplitStream;
