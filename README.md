[mmir-lib-dev][0]
============

[![MIT license](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/mmig/mmir-lib-dev/master)](https://github.com/mmig/mmir-lib-dev)

Development resources for [mmir-lib][2] and [mmir-tooling][1].

This multi-project repository contains resources for modified or
custom-built libraries for use in `mmir`.

### Project Structure

 * `conv-libs`:  
   constains projects for creating custom-built libraries
 * `doc`:  
   tools for generating `mmir` API docs
 * `template-parser`:  
   ANTLR 3 definition for the `mmir` view template parser


### Libraries

modified libraries

 * RequireJS 2.3.6  
   (BSD or MIT; Copyright jQuery Foundation and other contributors)
 * SCION v1, @scion-scxml/core v2.6.22 (custom build)  
   (LGPLv3, Apache License v2.0; Copyright 2018 Jacobean Research and Development, LLC)
 * JS/CC 0.30  
   (BSD; Copyright © 2007-2016 by Phorward Software Technologies; Jan Max Meyer; Brobston Development, Inc.; and other contributors)
 * PEG.js 0.10.0  
   (MIT; Copyright (c) 2010-2016 David Majda, Copyright (c) 2017+ Futago-za Ryuu)
 * Jison 0.4.18 (modified [mmig/jison#0.4.18-mre.1][3])  
   (MIT; Copyright (c) 2009-2014 Zachary Carter)
 * ANTLR 3  
   (BSD; Copyright (c) 2013 Terence Parr)
 * crypto-js MD5 3.1.9-1 (custom build)  
   (MIT; Copyright (c) 2009-2013 Jeff Mott, Copyright (c) 2013-2016 Evan Vosberg)

[0]: https://github.com/mmig/mmir-lib-dev
[1]: https://github.com/mmig/mmir-tooling
[2]: https://github.com/mmig/mmir-lib
[3]: https://github.com/mmig/jison/commits/0.4.18-mre.1
