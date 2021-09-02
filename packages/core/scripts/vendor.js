const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.resolve('scripts/externals.js'),
  output: {
    path: path.resolve('vendor'),
    filename: `vendor${process.env.NODE_ENV === 'production' ? '.min' : ''}.js`,
    libraryTarget: 'window',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        extractComments: false,
      }),
    ],
  },
};
