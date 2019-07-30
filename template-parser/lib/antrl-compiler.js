
var path = require('path');
var exec = require('child_process').exec;

var libFile = 'antlr-3.3-complete.jar';
var libDir = 'java';
var libPath = path.resolve(__dirname, '..', libDir, libFile);

function compile(srcDir, file, outputDir, oncomplete){
  var child = exec('java -jar ' + libPath + ' -o ' + outputDir + ' ' + file,
    {cwd: srcDir},
    function (error, stdout, stderr){
      if(stdout + '') console.log('stdout: ' + stdout);
      if(error !== null){
        console.log('exec error: ' + error);
      }
      oncomplete && oncomplete();
  });

  return child;
}

function compileFiles(srcDir, fileList, depFiles, outDir){

  var srcDirPath = path.isAbsolute(srcDir)? srcDir : path.resolve(process.cwd(), outDir);
  var outDirPath = path.isAbsolute(outDir)? outDir : path.resolve(process.cwd(), outDir);
  fileList.forEach(function(file){
    var deps = depFiles[file];
    depFiles[file] = null;
    compile(srcDirPath, file, outDirPath, deps? function(){compileFiles(srcDir, deps, depFiles, outDir)} : null);
  });
}


module.exports = {
  setLibPath: function(antrlJarPath){
    libPath = antrlJarPath;
  },
  compile: function(srcDir, srcFiles, dependentSrcFiles, outDir){

    //compile ANTRL sources:
    exec('java -version',
      function (error, stdout, stderr){
        if(error){
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          console.log('ERROR: command java is not availble - ', error);
        } else {
          compileFiles(srcDir, srcFiles, dependentSrcFiles, outDir);
        }
    });
  }
};
