const path = require('path');
const HtmlPlugin = require('./builder/plugins/html-plugin');
const CssPlugin = require('./builder/plugins/css-plugin');
const CopyPlugin = require('./builder/plugins/copy-plugin');


const outputPath = path.join(__dirname, 'project-dist')
const config = {
  output: outputPath,
  clear: true,
  plugins: [
    new HtmlPlugin({
      template: path.join(__dirname, 'template.html'),
      components: path.join(__dirname, 'components'),
      output: path.join(outputPath, 'index.html'),
    }),
    new CssPlugin({
      input: path.join(__dirname, 'styles'),
      output: path.join(outputPath, 'style.css')
    }),
    new CopyPlugin({
      input: path.join(__dirname, 'assets'),
      output: path.join(outputPath, 'assets'),
      recursive: true,
    })
  ]
}

module.exports = config;
