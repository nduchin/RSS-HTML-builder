const path = require('path');
const fs = require('fs');
const config = require(path.join(__dirname, 'builder', 'config.js'))

// TODO: main package-manager
/**
 * builder main function
 * @param {Object} config object
 */
async function builder({ output = __dirname,/* plugins = [] , clean = false*/}) {
  await fs.promises.mkdir(output).then(()=>{console.log('create dir')}).catch((err)=> {
    if (err.code === 'EEXIST') {
      console.log('dir already exists');
    } else {
      throw err;
    }
  });
  // plugins
  // done
}

builder(config)