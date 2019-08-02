/// <reference path="./types.d.ts" />

var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var gutil = require('gulp-util');
var jsdoc = require('gulp-jsdoc3');
var typedoc = require("gulp-typedoc");
var del = require('del');
var execFile = require('child_process').execFile;

var outDir = './api';
var outAllDir = './api-all';
var jaguarTemplateId = 'jaguarjs-jsdoc';
// var docstrapTemplateId = 'ink-docstrap';

var tsdocOutDir = './api-ts';

var getMmirPath = function(){
	return path.dirname(require.resolve('mmir-lib'));
};

var getTemplatePath = function(templateId){
	try {
		return path.dirname(require.resolve(templateId));
	} catch(err){
		var pkgPath = path.normalize(__dirname+'/node_modules/'+templateId);
		if(!fs.existsSync(pkgPath)){
			throw new Error('Could not find template package for '+templateId);
		}
		return pkgPath;
	}
};

var getJsonConfig = function(fileName) {
	return JSON.parse(fs.readFileSync(path.resolve(__dirname+'/'+fileName)));
}

var PROPERTIES_FILE = 'doc.properties';
var propsLoader = require('properties');

var _properties;
var loadProperties = function(cb){

	if(_properties){
		return cb(_properties);
	}

	var config = {};

	propsLoader.parse(PROPERTIES_FILE, {path: true, variables: true}, function(error, docConfig){

		if(error){
			throw error;
		}

		if(docConfig) for(var name in docConfig){

			if(docConfig.hasOwnProperty(name)){
				// console.log('apply setting '+name+':'+docConfig[name])
				config[name] = docConfig[name];
			}
		}

		_properties = config;
		cb(config);
	});
};

var cleanJsDoc = function(callback){

	var outPath = path.normalize(outDir);
	var outAllPath = path.normalize(outAllDir);
	del([outPath + '/**/*', outAllPath + '/**/*']);

	callback();
	return gutil.noop();
};

var genJsDoc = function(includePrivate, callback) {

	var config = getJsonConfig('conf-jsdoc3.json');

	var srcPath = getMmirPath();
	var outPath = includePrivate? path.resolve(outAllDir) : path.resolve(outDir);

	var templateId = jaguarTemplateId;
	var templatePath = getTemplatePath(templateId);

	var readmeFile = path.resolve(srcPath + '/../README.md');
	var packageJsonFile = path.resolve(srcPath + '/../package.json');

	config.opts.destination = outPath;
	config.opts.private = !!includePrivate;
	config.opts.template = templatePath;
	config.opts.readme = readmeFile;
	config.opts.package = packageJsonFile;


	gulp.src([srcPath+'/*.js', srcPath+'/!(vendor)/**/*.js'], {read: false})
        .pipe(jsdoc(config, callback));
};

gulp.task('gen_jsdoc', function(callback) {

	genJsDoc(false, callback);
});

gulp.task('gen_jsdoc_private', function(callback) {

	genJsDoc(true, callback);
});

gulp.task('gen_typedoc', function() {

	var config = getJsonConfig('typedoc.json');

	config.out = path.normalize(tsdocOutDir);
	config.name = 'mmir Tools and Plugins';

	return gulp
			.src(['node_modules/mmir-*/**/*.ts'])
			.pipe(typedoc(config));
});


gulp.task('gen_depDoc', function(callback) {

	loadProperties(function(settings){

		var args = [
			settings['dep.doc.generator.script'],
			settings['dep.doc.mmirf.base.dir'],
			settings['dep.doc.target.dir'],
			settings['dep.doc.temp.config.file'],
			settings['dep.doc.output.file']
		];

		var cwd = path.normalize(settings['dep.doc.working.dir']);
		execFile('node', args, {cwd: cwd} , function(error, stdout, stderr){

			console.error(stderr);
			if (error) {
				callback(error);
				return gutil.noop();
			}
			console.log(stdout);
			console.log('### created dependency graph visualisation at '+path.normalize(settings['dep.doc.working.dir']+settings['dep.doc.output.file']));

			callback();
			return gutil.noop();
		});

	});


});

gulp.task('clean_jsdoc', function(callback) {

	cleanJsDoc(callback);
});

gulp.task('clean_typedoc', function(callback) {

	var outPath = path.normalize(tsdocOutDir);
	del([outPath + '/**/*']);

	callback();
	return gutil.noop();
});

gulp.task('clean_depDoc', function(callback) {

	loadProperties(function(settings){

		del([
			 settings['dep.doc.working.dir'] + settings['dep.doc.temp.config.file'] + '/**/*',
			 settings['dep.doc.working.dir'] + settings['dep.doc.output.file'] + '/**/*'
		]);

		callback();
		return gutil.noop();
	});
	return gutil.noop();
});

gulp.task('jsdoc', gulp.series('clean_jsdoc', gulp.parallel(['gen_jsdoc', 'gen_jsdoc_private'])));

gulp.task('typedoc', gulp.series('clean_typedoc', 'gen_typedoc'));

gulp.task('depDoc', gulp.series('clean_depDoc', 'gen_depDoc'));

gulp.task('default', gulp.series('jsdoc'));
