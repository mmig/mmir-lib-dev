
var path = require('path');
var removeTimestamps = require('./lib/remove-timestamps');

var fileFilter = /\.js$/i;
var srcDir = 'dist';

var src = path.resolve(__dirname, srcDir);

removeTimestamps(src, fileFilter);
