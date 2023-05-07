const path = require('path');
const Loader = require('./builder/utilities/loader');
const config = require(path.join(__dirname, 'builder', 'config.js'))

// TODO: main package-manager
/**
 * builder main function
 * @param {Object} config object
 */
async function builder({ output = __dirname,/* plugins = [] , clean = false*/}) {
  await new Loader(output).mkDir({recursive: true}).untilResolve((res)=>setTimeout(()=>{res()},5000))
  console.log('dir done')
  // plugins
  // done
}

builder(config)