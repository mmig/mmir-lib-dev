
const path = require('path');
const _ = require('lodash')

const base = {
  entry: {
    'md5': './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    globalObject: "typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this",
    library: 'CryptoJS'
  },
  resolve: {
    extensions: ['.js']
  }
};

var dev = _.merge(_.cloneDeep(base), {
  name: 'dev',
  mode: 'development',
  devtool: false
});

var prod = _.merge(_.cloneDeep(base), {
  name: 'prod',
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].min.js'
  }
});

module.exports = [dev, prod];
