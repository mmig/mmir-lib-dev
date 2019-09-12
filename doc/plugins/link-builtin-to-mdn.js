
/**
 * jsdoc plugin that registers MDN (Mozilla Developer) links
 * for built-in JavaScript types
 */

var helper = require('jsdoc/util/templateHelper');

var links = {
  // Global_Objects references:
  Boolean:  '<g>/Boolean',
  Function: '<g>/Function',
  Number:   '<g>/Number',
  String:   '<g>/String',
  Array:    '<g>/Array',
  Date:     '<g>/Date',
  Error:    '<g>/Error',
  Object:   '<g>/Object',
  Promise:  '<g>/Promise',
  // API references:
  ProgressEvent:  '<a>/ProgressEvent',
  XMLHttpRequest: '<a>/XMLHttpRequest'
}

var baseUrls = {
  global: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects',
  api: 'https://developer.mozilla.org/en-US/docs/Web/API'
}

exports.handlers = {
  parseBegin: function(_sourcefiles){

    Object.keys(links).forEach(symbol => {
      var link = links[symbol];
      var url;
      // switch according to x in link-string "<x>..." (i.e. at index 1)
      switch(link[1]){
        case 'a':
          url = baseUrls.api;
          break;
        case 'g':
          url = baseUrls.global;
          break;
        default:
          //not supported
          return;//////////////// EARLY EXIT ////////////
      }

      url += link.substring(3);// <- use string without prefix "<.>" (i.e. starting from index 3)
      helper.registerLink(symbol, url);
    });
  }
}
