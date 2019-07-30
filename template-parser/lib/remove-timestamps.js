
var path = require('path');
var fs = require('fs');

function removeTimestamps(srcDir, fileFilter){

  fs.readdir(srcDir, function(err, files){

      if(err){
        return console.log('ERROR reading source directory "'+srcDir+'": ', err);
      }

      files.forEach(function(f){
        if(fileFilter.test(f)){
          var filePath = path.resolve(srcDir, f);
          fs.readFile(filePath, 'utf8', function(err, data){

              if(err){
                return console.log('ERROR reading file '+f+' from '+srcDir, err);
              }

              var re = /^\/\/ \$ANTLR.+\d\d\d\d \d\d:\d\d:\d\d( .+\.g\d? \d\d\d\d-\d\d-\d\d \d\d:\d\d:\d\d)$/gm, match;
              var sb = [];
              var last = 0;
              while(match = re.exec(data)){
                var pos = {
                  start: match.index + (match[0].length - match[1].length),
                  end: match.index + match[0].length
                };
                // console.log('    found match at ', pos, JSON.stringify(match[1]), ' -> ', JSON.stringify(data.substring(pos.start, pos.end)));
                sb.push(data.substring(last, pos.start));
                last = pos.end;
              }
              if(last < data.length){
                sb.push(data.substring(last, data.length));
              }
              var newData = sb.join('');

              // console.log('    with    timestamp -> ', JSON.stringify(data.substring(0, 100)));
              // console.log('    removed timestamp -> ', JSON.stringify(newData.substring(0, 100)));

              fs.writeFile(filePath, newData, 'utf8', function(err){
                  if(err){
                    return console.log('ERROR writing file '+f+' to '+srcDir, err);
                  }
                  console.log('removed timestamp from file '+f+'.');
              });
          });
        }
      })
  });

};

module.exports = removeTimestamps;
