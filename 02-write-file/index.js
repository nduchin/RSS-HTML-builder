const path = require('path');
const fs = require('fs');

const { stdin, stdout, exit } = process;

const filePath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(filePath);

function appendFile(data) {
  if (/exit/.test(data)) {exit(); }
  writeStream.write(data);
}

stdout.write('Input text\n');
stdin.on('data', appendFile);

process.on('exit', () => stdout.write('exiting program\n'));
process.on('SIGINT', () => { stdout.write('force '); exit(); });