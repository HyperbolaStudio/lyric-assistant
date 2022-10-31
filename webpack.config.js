const path = require('path');
module.exports = {
  mode: 'development',
  entry: './out/client/index.js',
  watch: true,
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: './dist/',
    filename: "bundle.js",
    chunkFilename: '[name].js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, '/dist/'),
    inline: true,
    host: 'localhost',
    port: 8080,
  }
};