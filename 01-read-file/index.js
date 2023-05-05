const path = require('path');
const fs = require('fs');

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
let data = '';
readStream.on('data', (chunk) => { data += chunk; });
readStream.on('end', () => console.log(data));