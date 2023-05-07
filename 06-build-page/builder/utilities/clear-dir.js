const path = require('path');
const Loader = require('./loader');

module.exports = async function clearDir(clearDir){
  let remList = [];
  await new Loader(clearDir).readDir((data)=>{
    remList = data.map(a=>a.name);
  })

  return Promise.all(remList.map((file)=>{
    return new Loader(path.join(clearDir, file)).rm({recursive: true}).untilResolve();
  }))
}

