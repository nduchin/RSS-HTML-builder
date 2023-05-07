const path = require('path');
const HtmlPlugin = require('./builder/plugins/html-plugin');

const output = path.join(__dirname, 'dist')
const config = {
  output: output,
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, 'template.html'),
      components: path.join(__dirname, 'components'),
      output: path.join(output, 'index.html'),
    })
  ]
}

module.exports = config;
