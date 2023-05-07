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
  // TODO: cleaner
  // plugins
  plugins.forEach((plugin) => {
    plugin.run()
  })

  // done


}

builder(config)