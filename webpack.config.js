var path = require('path');
var webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: "production",
  entry: './static/assets/js/main.js',
  output: {
      path: path.resolve(__dirname, 'static/js'),
      filename: 'bundle.js',
      publicPath: "/assets/",
  },
  module: {
      rules: [
          {
              test: /.js$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                  presets: ["@babel/preset-env"]
              }
          }
      ]
  },
  plugins: [
    new Dotenv()
  ],
  devtool: "source-map",
  node: {
    fs: 'empty'
  }
};