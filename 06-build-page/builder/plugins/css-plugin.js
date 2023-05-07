const Loader = require('../utilities/loader');
const loadComp = require('../utilities/load-comp');

/**
 * @param {String} sourcePath 
 * @returns {Promise}
 */
module.exports = class CssPlugin {
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
