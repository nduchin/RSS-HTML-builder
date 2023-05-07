const path = require('path');
const Loader = require('./builder/utilities/loader');
const config = require(path.join(__dirname, 'config.js'))

// TODO: main package-manager
/**
 * builder main function
 * @param {Object} config object
 */
async function builder({ output = __dirname, plugins = [] /*, clean = false*/}) {
  await new Loader(output).mkDir({recursive: true}).untilResolve()
  console.log('dir done')

  await Promise.all(plugins.map((plugin) => {plugin.run()}))

  console.log('build complete')
}

builder(config)