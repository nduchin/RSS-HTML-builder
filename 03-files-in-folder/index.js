const path = require('path');
const fs = require('fs');

async function getStats(dirents) {
  let res = await Promise.all(dirents.filter(dirent => dirent.isFile()).map(async(file) => {
    return [file.name, (await fs.promises.stat(path.join(folder, file.name))).size];
  }));
  return res.filter((elem) => !!elem);
}

function logFiles(files) {
  files.sort(fileSort).forEach((file) => {
    process.stdout.write(`${
      fixedWidth(path.parse(file[0]).name, 7)
    }-  ${
      fixedWidth(path.extname(file[0]).slice(1), 6)
    }-  ${
      fixedWidth((Math.floor(file[1]/102.4)/10).toString(),5)
    }KB (${
      fixedWidth(file[1].toString(), 6)
    }B)\n`)
  })
}

function fixedWidth(str, width) {
  if (str.length >= width) {
    return str.slice(0, width);
  } else {
    return str+' '.repeat(width - str.length)
  }
}

function fileSort(a, b) {
  if (a[1] > b[1]) return 1;
  if (a[1] < b[1]) return -1;
  if (a[0] > b[0]) return 1;
  if (a[0] < b[0]) return -1;
  return 0;
}

const folder = path.join(__dirname, 'secret-folder');
fs.promises.readdir(folder, {withFileTypes: true}).then(getStats).then(logFiles);
