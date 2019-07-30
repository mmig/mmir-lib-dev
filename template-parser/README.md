# MMIR View Template Parsing

Definition of MMIR view template parser in ANTLR 3

**NOTE**  
re-compiling the definitions will include a timestamp within the generated files,
so they will always be different than previously compiled ones!

## Prerequisites

 * Node.js
 * Java (in global path)

## Usage

If the parser definition needs to be changed:

 * modify corresponding definition in `src/*.g`
 * re-build parser (see below)
 * proceed in project [../conv-libs/module-shims](../conv-libs/module-shims/README.md)

## Build

run
```bash
npm run build
```

which will
 * compile `src/*.g` files into `dist/**` (generate JavaScript and meta-data files)
 * copy the compiled files from `dist/**` to `../conv-libs/module-shims/sourcelibs/**`
