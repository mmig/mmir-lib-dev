
/*
 * HELPER remove timestamps that ANTLR3 compiler insertes into the compiled resources
 *        -> for version control, so that recompiled sources should only "real" differences 
 */

var path = require('path');
var removeTimestamps = require('./lib/remove-timestamps');

var fileFilter = /\.js$/i;
var srcDir = 'dist';

var src = path.resolve(__dirname, srcDir);

removeTimestamps(src, fileFilter);
