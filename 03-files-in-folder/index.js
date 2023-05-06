const path = require('path');
const fs = require('fs');

async function getStats(files) {
  let res = await Promise.all(files.map((file) => {
    return fs.promises.stat(path.join(folder, file)).then((stat) => {
      return stat.size ? [file, path.extname(file).slice(1), stat.size] : null;
    });
  }));
  return res.filter((elem) => !!elem);
}

function logFiles(files) {
  console.debug(files.sort(fileSort));
}

function fileSort(a, b) {
  if (a[1] > b[1]) return 1;
  if (a[1] < b[1]) return -1;
  if (a[0] > b[0]) return 1;
  if (a[0] < b[0]) return -1;
  return 0;
}

const folder = path.join(__dirname, 'secret-folder');
fs.promises.readdir(folder).then(getStats).then(logFiles);
