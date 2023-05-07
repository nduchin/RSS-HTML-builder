const duplicateDir = require('../utilities/duplicate-dir');

module.exports = class CopyPlugin {
  constructor(options) {
    Object.assign(this, options)
  }
  async run() {
    console.log('copy start')
    await duplicateDir(this.input, this.output, {recursive:this.recursive, chunkSize:this.chunkSize})
    console.log('copy done')
  }
}