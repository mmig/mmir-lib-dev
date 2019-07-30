
var path = require('path');
var copy = require('./lib/copy-files');


var fileFilter = /\.js$/i;
var srcDir = 'dist';
var outDir = '../conv-libs/module-shims/sourcelibs';

var root = __dirname;

var src = path.resolve(root, srcDir);
var target = path.resolve(root, outDir);

copy(src, target, fileFilter);
