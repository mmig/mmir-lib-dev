
/* "minimal" replacement for node's util.inspect()  */

function inspect(obj, _opts) {
  try {
    return JSON.stringify(obj, dedupe(), 2);
  } catch(_err){
    return '' + obj;
  }
}
exports.inspect = inspect;

// adapted from https://careerkarma.com/blog/converting-circular-structure-to-json/
function dedupe() {
  const visited = createWeakSet();
  return function(_key, value) {
    if(typeof value === 'object' && value !== null) {
      if(visited.has(value)) {
        return '[Circular Reference]';
      }
      visited.add(value);
    }
    return value;
  };
};

// try to create WeakSet(), fall back to Set()
function createWeakSet() {
  if(typeof WeakSet !== 'undefined'){
    return new WeakSet();
  }
  return new Set();
}
