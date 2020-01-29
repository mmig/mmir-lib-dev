# Generating API Doc for MMIR

For the generating API documentation of the MMIR framework using jsdoc.

The `gulp` script creates docs for jsdoc3 and tsdoc (or a dependency graph)


    PROJECT_PATH/doc/api            (for jsdocs)
    PROJECT_PATH/doc/api-all        (for jsdocs with private etc visibility)
    PROJECT_PATH/doc/api-ts         (for tsdocs)
    PROJECT_PATH/doc/api-deps-graph (for depDoc)

with targets (depends on settings) `gulp jsdoc`.

In addition, a dependency graph for the mmir-lib modules can be generated using target `gulp depDoc`.

The default target is `doc`, i.e. this target is selected when running `gulp` without arguments.


See `doc.properties` for more properties/options concerning the
doc generation.


## Prerequisites


These prerequisites are required for automatically generating the doc-files

 * Node.js
 * Gulp CLI (command line interface)  
   `npm install -g gulp-cli`

Then, for installing the depedencies, run the following command  
`npm install`

### Installation and Configuration Details

If the directory

`PROJECT_PATH/doc/node_modules`

is missing, you should run `npm install` in `PROJECT_PATH/doc` in order to install

 * gulp
 * jsdoc (i.e. jsdoc3)
 * template docstrap for jsdoc3
 * template jaguarjs for jsdoc3
 * dependo


Ideally, you should use the latest jsdoc3 version >= v3.4.0-dev;
The `npm install` command will use the current jsdoc3 repository.


jsdoc3 is set to use the [docstrap][1] template by default, which is
automatically installed when `npm install` is run in the doc-dir.


## Notes

Note that the jsdoc3 generation uses some custom plugins in `/doc/plugins/` which are
referenced via the jsdoc3 configuration file `/doc/conf-jsdoc3.json` (if you use your
own script for generating the docs, you can use the command line parameter `-c CONFIG`
of jsdoc3 for using the configuration file; take care that the working directory from
which you call jsdoc3 corresponds to the configuration in `conf-jsdoc3.json`).


[1]: https://github.com/terryweiss/docstrap
