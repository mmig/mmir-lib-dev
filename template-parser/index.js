
var path = require('path');
var compiler = require('./lib/antrl-compiler');

var srcDir = 'src'
var outDir = 'dist';

var root = __dirname;

var srcFiles = [
  'MmirTemplate.g',
  'ES3.g3',
];

var dependentSrcFiles = {
  'MmirTemplate.g': [
    'MmirScript.g',
    'MmirScriptContent.g'
  ],
  'ES3.g3': [
    'MmirES3Walker.g'
  ]
};

compiler.compile(
  path.resolve(root, srcDir),
  srcFiles,
  dependentSrcFiles,
  path.resolve(root, outDir)
);
