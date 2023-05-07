const path = require('path');
const HtmlPlugin = require('./builder/plugins/html-plugin');

const config = {
  output: path.join(__dirname, 'dist'),
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, 'template.html'),
      components: path.join(__dirname, 'components'),
      output: path.join(__dirname, 'dist', 'index.html'),
    })
  ]
}

module.exports = config;
