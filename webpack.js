
var webpack = require('webpack');
var path = require('path');
var libraryName = 'matrix-mab';
var outputFile = libraryName + '.js';
console.log("dirname is ", __dirname)
var config = {
  entry: __dirname + '/lib/matrix-mab.js',
  target: "node",
  devtool: 'source-map',
  output: {
    path: __dirname + '/dist',
    filename: outputFile,
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ['babel-preset-es2015']
                }
            }
        }
    ],
  },
  resolve: {
    modules: [
        path.resolve('./lib'),
        "node_modules"
    ],
    extensions: ['.js']
  }
};

module.exports = config;
