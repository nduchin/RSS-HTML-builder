const path = require('path');
const Loader = require('../utilities/loader');

/**
 * @param {String} sourcePath 
 * @returns {Promise}
 */
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

module.exports = class HtmlPlugin {
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
      promiseComponents = loadComp(this.path.components)
    } else {
      promiseComponents = Promise.resolve({})
    }

    await Promise.all([l0.untilResolve(),promiseComponents])

    Object.entries(await promiseComponents).forEach((comp) => {
      templateData = templateData.replace(`{{${comp[0]}}}`,comp[1])
    })

    await new Loader(this.output).writeFile(templateData).untilResolve();
    console.log('html done')

  }
}