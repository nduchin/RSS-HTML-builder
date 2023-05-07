const path = require('path');
const Loader = require('./loader');

module.exports = async function duplicateDir(inputDir, outputDir, option) {
  let fileList = [], dirList = [];
  const l0 = new Loader(inputDir).readDir(data => {
    fileList = data.filter(d=>d.isFile()).map(d=>d.name);
    dirList = data.filter(d=>d.isDirectory()).map(d=>d.name);
  })
  await l0.untilResolve();
  await new Loader(outputDir).mkDir({recursive: true}).untilResolve()
  const prFileList = fileList.map((file)=>{
    return Loader.pipe(path.join(inputDir, file),path.join(outputDir, file), option ? option.chunkSize : undefined )
  })

  let prDirList = [];
  if (option && option.recursive) {
    prDirList = dirList.map((dir)=>{
      return duplicateDir(path.join(inputDir, dir), path.join(outputDir, dir), option);
    })
  }
  return Promise.all(prFileList.concat(prDirList))
}