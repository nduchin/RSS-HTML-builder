const path = require('path');
const Loader = require('./builder/utilities/loader');
const config = require(path.join(__dirname, 'config.js'))
const clearDir = require('./builder/utilities/clear-dir')

// TODO: main package-manager
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

builder(config)