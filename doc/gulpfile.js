/// <reference path="./types.d.ts" />

var path = require('path');
var fs = require('fs-extra');
var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc3');
var typedoc = require("gulp-typedoc");
var del = require('del');
var genDepsGraph = require('./dep-create-graph');

var outDir = './api';
var outAllDir = './api-all';
var jaguarTemplateId = 'jaguarjs-jsdoc';
// var docstrapTemplateId = 'ink-docstrap';

var tsdocOutDir = './api-ts';

tempDepConfigFile='./temp/dep-config.js';
depOutFile='./api-deps-graph/api-mmirf-dependencies.html'

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

var cleanJsDoc = function(callback){

	var outPath = path.normalize(outDir);
	var outAllPath = path.normalize(outAllDir);
	del([outPath + '/**/*', outAllPath + '/**/*']).then(function(){
		callback();
	});
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


gulp.task('gen_depsgraph', function(callback) {

	Promise.all([
		fs.ensureDir(path.dirname(depOutFile)),
		fs.ensureDir(path.dirname(tempDepConfigFile))
	]).then(function(){
		//TODO convert this to proper gulp task/plugin -> glup.src(..).pipe(createDepsGraph()).out(..)
		genDepsGraph.create(depOutFile, tempDepConfigFile);
		callback();
	});

});

gulp.task('clean_jsdoc', function(callback) {

	cleanJsDoc(callback);
});

gulp.task('clean_typedoc', function(callback) {

	var outPath = path.normalize(tsdocOutDir);
	del([outPath + '/**/*']).then(function(){
		callback();
	});
});

gulp.task('clean_depsgraph', function(callback) {

	del([tempDepConfigFile, depOutFile]).then(function(){
		callback();
	});

});

gulp.task('jsdoc', gulp.series('clean_jsdoc', gulp.parallel(['gen_jsdoc', 'gen_jsdoc_private'])));

gulp.task('typedoc', gulp.series('clean_typedoc', 'gen_typedoc'));

gulp.task('depsgraph', gulp.series('clean_depsgraph', 'gen_depsgraph'));

gulp.task('default', gulp.series('jsdoc'));
