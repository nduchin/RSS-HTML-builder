const path = require('path');
const {mkdir} = require('fs/promises');

// TODO: main package-manager
/**
 * builder main function
 * @param {Object} config object
 */
function builder({ output = __dirname}) {
  mkdir(output).then(()=>{console.log(`create dir`)}).catch((err)=> {
    if (err.code === 'EEXIST') {
      console.log(`dir already exists`)
    } else {
      throw err
    }
  });
  // mkdir 
  // plugins
  // done
}

// TODO: html-plugin
// TODO: css bundler-plugin
// TODO: assets copy-plugin

const config = {
  output: path.join(__dirname, 'dist'),
}

builder(config)