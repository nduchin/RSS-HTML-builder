const path = require('path');
const Loader = require('../utilities/loader');

async function loadComp(sourcePath) {
  const components = {};
  let names = [];
  await new Loader(sourcePath).readDir((data) => names=data).untilResolve();

  await Promise.all(names.map((name) => {
    let data = '';
    return new Loader(path.join(sourcePath, name)).readFile((chunk)=>data+=chunk).then(()=>{
      components[path.parse(name).name] = data;
    }).untilResolve()
  }));
  return components;
}

module.exports = class CssPlugin {
  constructor(options) {
    this.input = options.input;
    this.output = options.output;
  }
  async run() {
    const files = await loadComp(this.input)

    let bundle = '';
    Object.entries(files).forEach((file) => {
      bundle += `\n/*  ${file[0]}  */\n`
      bundle += file[1]
    })

    await new Loader(this.output).writeFile(bundle).untilResolve();
    console.log('css done')
  }
}
