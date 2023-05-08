const path = require('path')

/**
 * @param {String} sourcePath
 * @param {String} targetPath
 * @returns {Promise}
 */
async function copyDir (sourcePath, targetPath) {
  const fs = require('fs');
  let files = [];
  const pr0 = fs.promises.readdir(sourcePath, {withFileTypes: true}).then(dirents => files = dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name))
  const pr1 = fs.promises.mkdir(targetPath, {recursive: true})
  await Promise.all([pr0, pr1])
  return Promise.all(files.map(fileName => {
    const readStream = fs.createReadStream(path.join(sourcePath, fileName));
    const writeStream = fs.createWriteStream(path.join(targetPath, fileName));
    readStream.pipe(writeStream)
    return new Promise(res => readStream.on('end', res))
  }))
}

const sourcePath = path.join(__dirname, 'files');
const targetPath = path.join(__dirname, 'new-files');
copyDir(sourcePath, targetPath).then(console.log('duplication complete!'));
