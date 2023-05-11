const path = require('path');
const fs = require('fs');

/**
 * builder main function
 * @param {Object} config object
 */
async function builder({ output = __dirname, plugins = [], clear = false}) {
  await new Loader(output).mkDir({recursive: true}).untilResolve()
  if (clear) { await clearDir(output) }

  console.log('dir done')

  await Promise.all(plugins.map((plugin) => {plugin.run()}))

  console.log('build complete')
}

// Utilities
class Loader {
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
  readStream(writeFunc) {
    this.stream = fs.createReadStream(this.path, {highWaterMark: this.chunkSize});
    if (writeFunc) {this.stream.on('data',writeFunc)}
    this.promise = new Promise((res) => this.stream.on('end', res))
    return this.cover()
  }
  readDir(writeFunc) {
    this.promise = fs.promises.readdir(this.path,{withFileTypes: true});
    this.promise.then(writeFunc, rej => {throw rej})
    return this.cover();
  }
  writeFile(data) {
    this.promise = fs.promises.writeFile(this.path, data ? data : '');
    return this.cover();
  }
  writeStream(data) {
    this.stream = fs.createWriteStream(this.path)
    if (data) {this.stream.write(data)}
    this.promise = Promise.resolve();
    return this.cover()
  }
  mkDir(options) {
    this.promise = fs.promises.mkdir(this.path, options);
    return this.cover();
  }
  rm(options) {
    this.promise = fs.promises.rm(this.path, options);
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
    if (!this.promise) {
      console.error('loader isn\'t initialized')
      return Promise.reject()
    }
    if (untilFunc) {
      return new Promise((resolve, reject) => {this.promise.then(()=>untilFunc(resolve,reject))})
    } else {
      return this.promise ? this.promise : new Error('loader isn\'t initialized')
    }
  }
  static pipe(sourcePath, targetPath, chunkSize = 65536) {
    const l0 = new Loader(sourcePath, chunkSize)
    const l1 = new Loader(targetPath)
    l1.writeStream();
    l0.readStream();
    l0.stream.pipe(l1.stream)
    return l0.untilResolve()
  }
}

async function loadComp(sourcePath, ext) {
  const components = {};
  let names = [];
  await new Loader(sourcePath).readDir((data) => {
    names = data.filter((item)=> ( item.isFile() && (!ext || path.extname(item.name) === ext )))
    .map((a)=>a.name)
  }).untilResolve();

  await Promise.all(names.map((name) => {
    let data = '';
    return new Loader(path.join(sourcePath, name)).readFile((chunk)=>data+=chunk).then(()=>{
      components[path.parse(name).name] = data;
    }).untilResolve()
  }));
  return components;
}

async function duplicateDir(inputDir, outputDir, option) {
  let fileList = [], dirList = [];
  const l0 = new Loader(inputDir).readDir(data => {
    fileList = data.filter(d=>d.isFile()).map(d=>d.name);
    dirList = data.filter(d=>d.isDirectory()).map(d=>d.name);
  })
  await l0.untilResolve();
  await new Loader(outputDir).mkDir({recursive: true}).untilResolve()
  const prFileList = fileList.map((file)=>{
    return Loader.pipe(path.join(inputDir, file),path.join(outputDir, file), option ? option.chunkSize : undefined )
  })

  let prDirList = [];
  if (option && option.recursive) {
    prDirList = dirList.map((dir)=>{
      return duplicateDir(path.join(inputDir, dir), path.join(outputDir, dir), option);
    })
  }
  return Promise.all(prFileList.concat(prDirList))
}

async function clearDir(clearDir){
  let remList = [];
  await new Loader(clearDir).readDir((data)=>{
    remList = data.map(a=>a.name);
  })

  return Promise.all(remList.map((file)=>{
    return new Loader(path.join(clearDir, file)).rm({recursive: true}).untilResolve();
  }))
}

// Plugins
class HtmlPlugin {
  path = {};
  constructor(options) {
    this.path.template = options.template;
    this.path.components = options.components;
    this.output = options.output
  }

  async run() {
    let templateData = '';
    const l0 = new Loader(this.path.template).readFile((chunk) => templateData += chunk);

    let promiseComponents;
    if (this.path.components) {
      promiseComponents = loadComp(this.path.components,'.html')
    } else {
      promiseComponents = Promise.resolve({})
    }

    await l0.untilResolve()

    Object.entries(await promiseComponents).forEach((comp) => {
      templateData = templateData.replace(`{{${comp[0]}}}`,comp[1])
    })

    return new Loader(this.output).writeFile(templateData).untilResolve();
  }
}

class CssPlugin {
  constructor(options) {
    this.input = options.input;
    this.output = options.output;
  }
  async run() {
    const files = await loadComp(this.input, '.css')

    let bundle = '';
    Object.entries(files).forEach((file, i) => {
      bundle += `${i>0?'\n':''}/*  ${file[0]}  */\n`
      bundle += file[1]
    })

    return new Loader(this.output).writeFile(bundle).untilResolve();
  }
}

class CopyPlugin {
  constructor(options) {
    Object.assign(this, options)
  }
  async run() {
    return duplicateDir(this.input, this.output, {recursive:this.recursive, chunkSize:this.chunkSize})
  }
}

// Config

const outputPath = path.join(__dirname, 'project-dist')
const config = {
  output: outputPath,
  clear: true,
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, 'template.html'),
      components: path.join(__dirname, 'components'),
      output: path.join(outputPath, 'index.html'),
    }),
    new CssPlugin({
      input: path.join(__dirname, 'styles'),
      output: path.join(outputPath, 'style.css')
    }),
    new CopyPlugin({
      input: path.join(__dirname, 'assets'),
      output: path.join(outputPath, 'assets'),
      recursive: true,
    })
  ]
}

builder(config)