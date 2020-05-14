
var path = require('path');
var fs = require('fs');
var proc = require('./lib/process-requirejs-shims.js');
var minProc = require('./lib/process-min.js');

var inp = path.resolve(__dirname, './');
var outp = path.resolve(__dirname, './dist');

//update libraries from installed dependencies:
// 1. update (modified) jison
var jisonSrc = 'node_modules/jison/dist/jison.js';
var jisonTarget = require('./lib/config/requirejs-dev-config').paths['mmirf/jison'];
console.log('copy ',jisonSrc, ' -> ', jisonTarget + '.js')
fs.copyFileSync(jisonSrc, jisonTarget + '.js')

//non-minified:
proc.process(inp, outp);

//minified:
minProc.process(inp, outp);
