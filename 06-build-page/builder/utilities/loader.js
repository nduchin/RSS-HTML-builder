const fs = require('fs');

module.exports = class Loader {
  constructor(path = __dirname, chunkSize = 65536) {
    this.path = path;
    this.chunkSize = chunkSize;
  }
  resolve(func) {
    this.promise = new Promise(func);
    this.cover();
  }
  readFile(writeFunc) {
    return this.getSize().then((size) => {
      if (size < this.chunkSize) {
        this.promise = fs.promises.readFile(this.path);
        this.promise.then(writeFunc, rej => {throw rej})
      } else {
        this.stream = fs.createReadStream(this.path, {highWaterMark: this.chunkSize})
        if (writeFunc) {this.stream.on('data',writeFunc)}
        this.promise = new Promise((res) => this.stream.on('end', res))
      }
      this.cover();
    })
  }
  readDir(writeFunc) {
    this.promise = fs.promises.readdir(this.path);
    this.promise.then(writeFunc, rej => {throw rej})
    this.cover();
  }
  writeFile(data) {
    this.promise = fs.promises.writeFile(this.path, data ?? '');
    this.cover();
  }
  mkDir() {
    this.promise = fs.promises.mkdir(this.path);
    this.cover();
  }
  rm() {
    this.promise = fs.promises.rm(this.path);
    this.cover();
  }
  rmDir() {
    this.promise = fs.promises.rmdir(this.path);
    this.cover();
  }
  getSize() {
    return fs.promises.stat(this.path).then((stat)=>stat.size);
  }
  cover() {
    if (this.thenFunc) {this.promise.then(this.thenFunc)}
    return this;
  }
  set then(func) {
    this.thenFunc = func;
    if (this.promise) {this.promise.then(this.thenFunc)}
    return;
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