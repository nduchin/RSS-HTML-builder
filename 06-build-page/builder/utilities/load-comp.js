const path = require('path');
const Loader = require('./loader');

module.exports = async function loadComp(sourcePath) {
  const components = {};
  let names = [];
  await new Loader(sourcePath).readDir((data) => names=data).untilResolve();

  await Promise.all(names.map((name) => {
    let data = '';
    return new Loader(path.join(sourcePath, name)).readFile((chunk)=>data+=chunk).then(()=>{
      components[path.parse(name).name] = data;
    }).untilResolve()
  }));
  return components;
}