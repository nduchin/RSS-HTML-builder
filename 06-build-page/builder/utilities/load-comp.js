const path = require('path');
const Loader = require('./loader');

module.exports = async function loadComp(sourcePath, ext) {
  const components = {};
  let names = [];
  await new Loader(sourcePath).readDir((data) => {
    names = data.filter((item)=> ( item.isFile() && (!ext || path.extname(item.name) === ext )))
    .map((a)=>a.name)
  }).untilResolve();

  await Promise.all(names.map((name) => {
    let data = '';
    return new Loader(path.join(sourcePath, name)).readFile((chunk)=>data+=chunk).then(()=>{
      components[path.parse(name).name] = data;
    }).untilResolve()
  }));
  return components;
}