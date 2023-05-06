const path = require('path')

/**
 * @param {String} sourcePath
 * @param {String} targetPath
 * @returns {Promise}
 */
async function copyDir (sourcePath, targetPath) {
  const { readdir, mkdir, readFile, writeFile } = require('fs/promises');
  async function duplicateFile (sourceDir, fileName, targetDir) {
    return readFile(path.join(sourceDir, fileName)).then((data) => {
      return writeFile(path.join(targetDir, fileName), data);
    }).then(()=>{ console.log(`write file ${fileName}`) })
  }
  return readdir(sourcePath).then(async (files) => {
    await mkdir(targetPath).then(()=>{console.log(`create dir ${targetPath}`)}).catch((err)=> {
      if (err.code === 'EEXIST') {
        console.log(`dir ${targetPath} already exists`)
      } else {
        throw err
      }
    });
    return files;
  }).then((files) => {
    return Promise.all(files.map((fileName)=>{
      duplicateFile(sourcePath, fileName, targetPath)
    }))
  })
}

const sourcePath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'new-files');
copyDir(sourcePath, targetPath).then(console.log('duplication complete!'));
