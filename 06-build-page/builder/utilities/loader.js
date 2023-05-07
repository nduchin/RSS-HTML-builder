const fs = require('fs');

module.exports = class Loader {
  constructor(path = __dirname, chunkSize = 65536) {
    this.path = path;
    this.chunkSize = chunkSize;
  }
  resolve(func) {
    this.promise = new Promise(func);
    return this.cover();
  }
  readFile(writeFunc) {
    this.promise = this.getSize().then((size) => {
      if (size < this.chunkSize) {
        const prom =  fs.promises.readFile(this.path);
        prom.then(writeFunc)
        return prom
      } else {
        this.stream = fs.createReadStream(this.path, {highWaterMark: this.chunkSize})
        if (writeFunc) {this.stream.on('data',writeFunc)}
        return new Promise((res) => this.stream.on('end', res))
      }
    })
    return this.cover();
  }
  readDir(writeFunc) {
    this.promise = fs.promises.readdir(this.path);
    this.promise.then(writeFunc, rej => {throw rej})
    return this.cover();
  }
  writeFile(data) {
    this.promise = fs.promises.writeFile(this.path, data ?? '');
    return this.cover();
  }
  mkDir(options) {
    this.promise = fs.promises.mkdir(this.path, options);
    return this.cover();
  }
  rm() {
    this.promise = fs.promises.rm(this.path);
    return this.cover();
  }
  rmDir() {
    this.promise = fs.promises.rmdir(this.path);
    return this.cover();
  }
  getSize() {
    return fs.promises.stat(this.path).then((stat)=>stat.size);
  }
  cover() {
    if (this.thenFunc) {this.promise.then(this.thenFunc)}
    return this;
  }
  then(func) {
    this.thenFunc = func;
    if (this.promise) {this.promise.then(this.thenFunc)}
    return this;
  }
  untilResolve(untilFunc) {
    if (!this.promise) {return new Error('loader isn\'t initialized')}
    if (untilFunc) {
      return new Promise((resolve, reject) => {this.promise.then(()=>untilFunc(resolve,reject))})
    } else {
      return this.promise ?? new Error('loader isn\'t initialized')
    }
  }
  static pipe(sourcePath, targetPath, chunkSize = 65536) {
    const l0 = new Loader(sourcePath, chunkSize)
    const l1 = new Loader(targetPath)
    let data;
    l0.readFile((chunk)=>data+=chunk)
    l0.then = (()=>l1.writeFile(data))
    return l1;
  }
}