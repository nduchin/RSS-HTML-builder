const path = require('path');
const Loader = require('../utilities/loader');
const loadComp = require('../utilities/load-comp')

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

    await l0.untilResolve()

    Object.entries(await promiseComponents).forEach((comp) => {
      templateData = templateData.replace(`{{${comp[0]}}}`,comp[1])
    })

    return new Loader(this.output).writeFile(templateData).untilResolve();
  }
}