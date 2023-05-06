const path = require('path');
const fs = require('fs');

/**
 *
 * @param {String} sourceDir
 * @param {String} targetDir
 * @returns {Promise}
 */
async function inject(sourceDir, writeStream) {
  const read = fs.createReadStream(sourceDir);
  read.pipe(writeStream);
  return await read.on('end',()=>{});
}

/**
 * 
 * @param {Array} dirs 
 * @param {String} targetDir 
 */
async function injectSeq(dirs, writeStream) {
  dirs.reduce((req, dir) => {
    return req.then(()=>{
      console.log(`Init injecting ${dir}`)
      return inject(dir, writeStream)
    })
  }, Promise.resolve().then(()=>console.log('complete'),(e)=>{throw e}))
}

function injectFromTo(sourceName, targetName) {
  const writeStream = fs.createWriteStream(targetName);
  fs.promises.readdir(sourceName).then((arr)=>arr.filter((name)=>path.extname(name) === '.css').sort()).then((arr)=>{
    return arr.map((name)=>path.join(sourceName, name))
  }).then((dirs)=>{
    injectSeq(dirs, writeStream);
  })
}

injectFromTo(path.join(__dirname, 'styles'),path.join(__dirname, 'project-dist', 'bundle.css'))
injectFromTo(path.join(__dirname,'test-files', 'styles'),path.join(__dirname, 'test-files', 'bundle.css'))