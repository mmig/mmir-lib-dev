
var path = require('path');
var proc = require('./lib/process-requirejs-shims.js');
var minProc = require('./lib/process-min.js');

var inp = path.resolve(__dirname, './');
var outp = path.resolve(__dirname, './dist');

//non-minified:
proc.process(inp, outp);

//minified:
minProc.process(inp, outp);
