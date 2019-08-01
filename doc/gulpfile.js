
var path = require('path');
var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var exec = require('child_process').exec;
var execFile = require('child_process').execFile;

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
	loadProperties(function(settings){

		del([settings['dir.out.jsdoc'] + '/**/*']);

		callback();
		return gutil.noop();
	});
	return gutil.noop();
};

gulp.task('gen_jsdoc', function(callback) {

	loadProperties(function(settings){

		var args = [
			settings['default.options.jsdoc.v3'],
			'-c ' + path.normalize(settings['file.config.jsdoc.v3']),
			'-d ' + path.normalize(settings['dir.out.jsdoc']),
			'-t ' + path.normalize(settings['template.jsdoc.v3']),
			'-R '  + path.normalize(settings['dir.src.in'] + '/../README.md'),
			'-P '  + path.normalize(settings['dir.src.in'] + '/../package.json'),
			path.normalize(settings['dir.src.in'])
		];

		var cmd = path.normalize(settings['exec.jsdoc.v3']) + ' ' + args.join(' ');
		console.log('### '+cmd)
		var child = exec(cmd, function(error, stdout, stderr){

			console.error(stderr);
			if (error) {
				callback(error);
				return gutil.noop();
			}
			// console.log(stdout);
			console.log('### wrote jsdoc3 files to '+path.normalize(settings['dir.out.jsdoc']));

			callback();
			return gutil.noop();
		});

		//print conosle-output immediately as a way of progress-feedback (since jsdoc3 may take some time to process the files)
		child.stdout.on('data', function(data){
			console.log('	 ' + data.replace(/\r?\n$/, ''));
		});

	});


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
		var child = execFile('node', args, {cwd: cwd} , function(error, stdout, stderr){

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

gulp.task('jsdoc', gulp.series('clean_jsdoc', 'gen_jsdoc'));

gulp.task('depDoc', gulp.series('clean_depDoc', 'gen_depDoc'));

gulp.task('default', gulp.series('jsdoc'));
