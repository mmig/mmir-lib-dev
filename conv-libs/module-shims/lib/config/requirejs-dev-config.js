;(function (root, factory) {
		if (typeof define === 'function' && define.amd) {
				// AMD. Register as an anonymous module.
				define(function () {
						return factory();
				});
		} else if (typeof module === 'object' && module.exports) {
				// Node. Does not work with strict CommonJS, but
				// only CommonJS-like environments that support module.exports,
				// like Node.
				module.exports = factory();
		} else {
				// Browser globals
				root.mmirDevConfig = factory();
		}
}(typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : typeof global !== 'undefined' ? global : this, function () {

	return {
		paths: {

			//modified vendor libs:
			  'mmirf/jscc': 'modified-vendor-sourcelibs/jscc-umd'
			, 'mmirf/jison': 'modified-vendor-sourcelibs/jison'   //copied from node_modules/jison/dist/jison.js

			//unmodified vendor libs
			, 'mmirf/pegjs': 'vendor-sourcelibs/peg-0.10.0'
			, 'mmirf/require': 'vendor-sourcelibs/require'
			, 'mmirf/stacktrace': 'vendor-sourcelibs/stacktrace-v2.0.0'
		}
	}

}));
