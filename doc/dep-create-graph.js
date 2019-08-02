/// <reference path="./types.d.ts" />

var Dependo = require('dependo'),
 	fs = require('fs')
  path = require('path');

//HELPER get & ceate require-config call from framework's modulesBaseConfig.js
//       ... and adjust >baseUrl< in require-config
//       -> writes extracted require-config to file >configPath<
function createRequireConfig(basePath, configPath){

  var reqConfig = require(basePath + '/modulesBaseConfig.js');

  reqConfig.baseUrl = path.normalize(basePath + path.sep);

	var reqConfigStr = JSON.stringify(reqConfig, null, 4);

	var reqStr = 'require.config(' + reqConfigStr + ');';

	fs.writeFileSync(configPath, reqStr, 'utf8');
}

//HELPER wrap source code as AMD module
function wrapAsModule(str, deps){

	var depsStr;
	if(deps){
		var list = [];
		for(var p in deps){
			if(deps.hasOwnProperty(p)){
				list.push(deps[p]);
			}
		}
		depsStr = JSON.stringify(list) + ', ';
	} else {
		depsStr = '';
	}

	return '\ndefine('+depsStr+'function(){\n\n' + str + '\n\n});';
}

//HELPER inject additional dependencies into define-statement
function injectDeps(str, depList){

  var match;
	if(!(match = /define(\s|\r?\n)*\(/.exec(str))){
    var deps = {};
    depList.forEach(function(d){deps[d]=d});
    return wrapAsModule(str, deps);
  } else {
    var m = match, depStr = JSON.stringify(depList);
    if(m = /define(\s|\r?\n)*\((\s|\r?\n)*\[/.exec(str)){
      match = m;
      depStr = depStr.replace(/\[/, '').replace(/\]/, '');
    }
    return str.substring(0, match.index) + match[0] + depStr + ',' + str.substring(match.index + match[0].length, str.length);
  }
}

//extract dependencies from "simple" require calls, i.e. sync'ed/non-deps-list call like
//		require('dep')
function extractSimpleReqCalls(str){

	var deps = {}, re = /require\s*\(\s*('([^']+)'|"([^"]+)")/g, len = 0, match;

	while((match = re.exec(str))){
		if(match[2]){
			++len;
			deps[match[2]] = match[2];
		}
		if(match[3]){
			++len;
			deps[match[3]] = match[3];
		}
	}

	return len > 0? deps: void(0);
}

//src-modifier: fix source code, so that dependencies get detected
//	-> used in options.onParseFile
function fixImportScript(file){//{filename: STRING, src: STRING}

	var fileName = file.filename.replace(__dirname, '').replace(/\\/gm, '/');
	fileName = fileName.replace(/^\//, '');

	//convert importScripts() to require()
	if(/importScripts\s*\(/g.test(file.src)){

		console.log('  detected importScript for '+fileName);

		if(/^workers\//i.test(fileName)){

			if(/importScripts\s*\(\s*'/g.test(file.src)){
				file.src = file.src.replace(/importScripts\s*\(\s*(')([^']+)(')/g, function(_match, p1, p2, p3){
					return 'require(' + p1 + 'workers/' + p2.replace(/\.js$/i, '') + p3;
				});
			}

			if(/importScripts\s*\(\s*"/g.test(file.src)){
				file.src = file.src.replace(/importScripts\s*\(\s*(")([^"]+)(")/g, function(_match, p1, p2, p3){
					return 'require(' + p1 + 'workers/' + p2.replace(/\.js$/i, '') + p3;
				});
			}

		}
		file.src = wrapAsModule(file.src.replace(/importScripts\s*\(/g, 'require('));

	}

  //DISABLED: env/media/** are now AMD modules (since mmir v5.x)
	// if(/env\/media\//i.test(fileName)){
  //
	// 	//"pull-up" simple require-calls (these seem to to not get detected otherwise)
	// 	deps = extractSimpleReqCalls(file.src);
  //
	// 	file.src = wrapAsModule(file.src);//, deps);
	// }

  if(/tools\/util_jquery\//.test(fileName)){

    var jsUtilName = fileName.replace(/.*tools\/util_jquery\//, 'tools/util_purejs/').replace(/\.js$/i, '');

    console.log('  detected jquery module, adding util_purejs variant as depencency -> ', jsUtilName);

    file.src = injectDeps(file.src, [jsUtilName]);
  }

	//"convert" any non-modules to modules
	// NOTE: this may fail to detect, if a script is not a module (i.e. if there is any "define(" contained, but script itself is not a module)
	if(!/define\s*\(/g.test(file.src)){
		file.src = wrapAsModule(file.src);
	}


	return file;
}

function createDepsHtmlFile(outputPath, configPath, baseUrl, depOptions){

  //the basePath to the mmirf-directory (that is: its /lib sub-dir) which will be parsed for dependencies
  baseUrl = baseUrl || path.dirname(require.resolve('mmir-lib'));

  //path to the (temp) config-file that will by used for dependency parsing
  configPath = configPath || 'dep-req-config.js';

  //ouput HTML file that will be created
  outputPath = outputPath || 'dep.html';

  var options = depOptions || {
  		format: 'amd',
  		requireConfig: 'dep-req-config.js',
  		exclude: '^node_modules|^vendor|^dep-',
  //		onParseFile: ,
  		findNestedDependencies: true,
  		title: 'MMIR Framework Dependencies (v5.0.0)'
  };

  console.log('processing dependencies for: '+baseUrl);
  createRequireConfig(baseUrl, configPath);
  var targetPath = baseUrl;
  options.requireConfig = configPath;
  options.onParseFile = fixImportScript;

  var dependo;
  try {

  	dependo = new Dependo(targetPath, options);

  	var html = dependo.generateHtml();

  	//console.log(html);

  	fs.writeFileSync(outputPath, html, 'utf8');
  	console.log('created file', path.resolve(outputPath));

  } catch(err){
  	console.error(err.message + ', line '+ err.line + ', col '+ err.col + ', pos '+ err.pos + '\n\t' + err.stack + '\n', err);
  }
}

function processCli(){

    var baseUrl, configPath, outputPath;
    //optional command-line arguments
    //1. basePath (OPTIONAL)	the path to the mmir-lib's /lib directory (default: './')
    //2. configPath (OPTIONAL)	the path to the temporary requirejs config (used for dependency parsing)
    //3. outputPath (OPTIONAL)	the output path for creating the HTML file
    var arguments = process.argv;
    var argslen = arguments.length;
    if(argslen >= 2){
      baseUrl = arguments[2];
      console.log('non-default basePath: "'+baseUrl+'"');
    }
    if(argslen >= 3){
      configPath = arguments[3];
      console.log('non-default configPath: "'+configPath+'"');
    }
    if(argslen >= 4){
      outputPath = arguments[4];
      console.log('non-default outputPath: "'+outputPath+'"');
    }

    createDepsHtmlFile(outputPath, configPath, baseUrl);
}

module.exports = {
  create: createDepsHtmlFile,
  cli: processCli
}

//detect if was invoked as cli
if(process.argv[1] === __filename){
  console.log('## CLI')
  processCli();
}
