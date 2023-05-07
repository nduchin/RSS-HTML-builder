const fs = require('fs');

class Loader {
  constructor(path, type, callBack, callBackOnData) {
    this.path = path;
    this.type = type;
    this.callBack = callBack;
    this.callBackOnData = callBackOnData;
  }
  run(data) {
    switch (this.type) {
      case 'read': fs.readFile(this.path, this.callBack); break;
      case 'write': fs.writeFile(this.path, data ?? '', this.callBack); break;
      case 'readdir': fs.readdir(this.path, this.callBack); break;
      case 'readStream': {
        this.stream = fs.createReadStream(this.path);
        this.stream.on('data', this.callBackOnData);
        this.stream.on('end', this.callBack);
        break;
      }
      case 'writeStream': {
        this.stream = fs.createWriteStream(this.path);
        this.callBack();
        break;
      }
      default: this.callBack(); break;
    }
  }
}

module.exports = Loader;