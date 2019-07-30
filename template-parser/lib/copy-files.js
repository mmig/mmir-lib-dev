
var path = require('path');
var fs = require('fs');

function copySources(srcDir, targetDir, fileFilter){

  fs.readdir(srcDir, function(err, files){

      if(err){
        return console.log('ERROR reading source directory "'+srcDir+'": ', err);
      }

      files.forEach(function(f){
        if(fileFilter.test(f)){
          fs.copyFile(path.resolve(srcDir, f), path.resolve(targetDir, f), function(err){
            if(err){
              return console.log('ERROR copying file '+f+' from '+srcDir+' to '+targetDir+': ', err);
            }
            console.log('copied file '+f+' to '+targetDir+'.');
          });
        }
      })
  });

};

module.exports = copySources;
