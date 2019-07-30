# module-shims

sub-project for compiling generated & vendor libs:

if lib was modified for use in `mmir`, this will
 * compile AMD shim, if lib is not exported as AMD module
 * create minified versions with `*.map` file if not available for lib

## Usage

### Modify

For modifying/updating libs:

 * updated vendor library:
   * copy to `/vendor-sourcelibs` and re-build (see below)

 * modified vendor library:
   * copy to `/modified-vendor-sourcelibs` and re-build (see below)

 * modified (generated) `mmir` template parser:
   * modify and re-build template parser definition in [../../template-parser](../../template-parser/README.md)
     _(which will update files in `/sourcelibs`)_
   * re-build libs (see below)

 * adding (new) lib for `minifying`:  
   update `/lib/config/requirejs-dev-config.js`

 * adding (new) non-AMD/UMD lib:  
   update `conv-libs/module-shims/lib/config/requirejs-sim-config.js` (similar to `requirejs` shim definitions)
   * may need to add `prefix-/suffix-template` in `/lib/templates/<lib file name>.template`
     for complex shims

### Build

install dependencies if necessary

    npm install

compile libs

    npm run build

copy files

 * `/dist/vendor` -> `<mmir-lib-src>/vendor/libs`
 * `/dist/gen` -> `<mmir-lib-src>/mvc/parser/gen`

## Project Structure

```

/dist
  the compiled libs incl. minified & map

/lib
  code etc. for executing compilation

/modified-vendor-sourcelibs
  modified vendor libs

/sourcelibs
  generated libs

/vendor-sourcelibs
  original/unmodified vendor libs

```
