const path = require('path');
const HtmlPlugin = require('./builder/plugins/html-plugin');
const CssPlugin = require('./builder/plugins/css-plugin');

const output = path.join(__dirname, 'dist')
const config = {
  output: output,
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, 'template.html'),
      components: path.join(__dirname, 'components'),
      output: path.join(output, 'index.html'),
    }),
    new CssPlugin({
      input: path.join(__dirname, 'styles'),
      output: path.join(output, 'bundle.css')
    })
  ]
}

module.exports = config;
